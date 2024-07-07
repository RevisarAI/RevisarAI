import OpenAI from 'openai';
import { IActionItem, IActionItemSchema, IReviewMinimal, IWeeklyActionItemsRequestSchema } from 'shared-types';
import winston from 'winston';
import config from './config';
import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import weeklyActionItemsModel from './models/weekly-action-items.model';
import reviewModel from './models/review.model';
import createLogger from 'revisar-server-utils/logger';
import { z } from 'zod';

export class ReviewsConsumer {
  private kafkaConsumer: Consumer;
  private logger: winston.Logger;
  private openai: OpenAI;

  public constructor() {
    this.kafkaConsumer = this.createKafkaConsumer();
    this.logger = createLogger('action-items-generator-consumer');
    this.openai = new OpenAI({ apiKey: config.openaiApiKey });
  }

  public async startConsumer(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topic: config.topic, fromBeginning: false });

    await this.kafkaConsumer.run({
      autoCommit: false,
      eachMessage: async (messagePayload: EachMessagePayload) => {
        const { topic, partition, message } = messagePayload;
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        this.logger.info(`- ${prefix} ${message.key}#${message.value}`);

        const request = IWeeklyActionItemsRequestSchema.parse(JSON.parse(message.value!.toString()));
        const requestDate = new Date(request.date);
        const weekBeforeRequest = new Date(requestDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const lastWeekReviews = await reviewModel
          .find({
            businessId: request.client.businessId,
            date: { $gte: weekBeforeRequest, $lt: requestDate },
          })
          .sort({ importance: -1 })
          .limit(20);

        if (lastWeekReviews.length === 0) {
          this.logger.info(`No reviews found for client: ${request.client.businessId}`);
          this.kafkaConsumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
        } else {
          const minialLastWeekReviews: IReviewMinimal[] = lastWeekReviews.map((review) => ({
            _id: review._id,
            value: review.value,
          }));

          const systemPrompt = `Context:
You are an expert analyst that is hired by "${request.client.businessName}" to analyze their reviews and extract the most important action items for the next week.
Input:
A list of reviews from the past week provided by the company in a JSON format, each review containing an id and a value.
Goal:
The goal is to extract the 5 most important action items for the next week based on the provided reviews.
Each action item should include an explanation with references and ids from the list of reviews.
General Instructions:
The action items should be:
1. Clear and actionable.
2. Based on the reviews provided.
3. Prioritized based on the importance of the reviews.
4. Diverse and cover different aspects of the reviews.`;

          this.logger.info(`Generating action items with Openai for client: ${request.client.businessId}...`);
          const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: JSON.stringify(minialLastWeekReviews) },
              {
                role: 'system',
                content: 'Output: in JSON: [{"value": string, "reason": string}].',
              },
            ],
          });
          const actionItems: IActionItem[] = z
            .array(IActionItemSchema)
            .parse(JSON.parse(response.choices[0].message.content!));
          this.logger.info(`Generated action items: ${JSON.stringify(actionItems)}`);

          await weeklyActionItemsModel.create({
            actionItems,
            date: requestDate,
            businessId: request.client.businessId,
          });

          this.kafkaConsumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
        }
      },
    });
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const brokers = config.kafkaBrokers.split(',');

    const kafka = new Kafka({
      clientId: 'weekly-action-items-consumer',
      brokers,
      retry:
        process.env.NODE_ENV === 'production'
          ? { initialRetryTime: 100, retries: 8 }
          : { initialRetryTime: 300, retries: 2 },
    });
    const consumer = kafka.consumer({ groupId: config.consumerGroup });
    return consumer;
  }
}

const initConsumer = async () => {
  const consumer = new ReviewsConsumer();
  await consumer.startConsumer();

  const errorTypes = ['unhandledRejection', 'uncaughtException'];
  const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  errorTypes.forEach((type) => {
    process.on(type, async (e) => {
      try {
        console.log(`process.on ${type}`);
        console.error(e);
        await consumer.shutdown();
        process.exit(0);
      } catch (_) {
        process.exit(1);
      }
    });
  });

  signalTraps.forEach((type) => {
    process.once(type, async () => {
      try {
        await consumer.shutdown();
      } finally {
        process.kill(process.pid, type);
      }
    });
  });
};

export default initConsumer;
