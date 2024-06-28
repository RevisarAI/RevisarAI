import OpenAI from 'openai';
import { IActionItem, IActionItemSchema, IReviewMinimal, IWeeklyActionItemsRequestSchema } from 'shared-types';
import createLogger from './utils/logger';
import winston from 'winston';
import config from './config';
import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import weeklyActionItemsModel from './models/weekly-action-items.model';
import reviewModel from 'models/review.model';
import { z } from 'zod';

export class ReviewsConsumer {
  private kafkaConsumer: Consumer;
  private logger: winston.Logger;
  private openai: OpenAI;

  public constructor() {
    this.kafkaConsumer = this.createKafkaConsumer();
    this.logger = createLogger('consumer');
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

        const minialLastWeekReviews: IReviewMinimal[] = lastWeekReviews.map((review) => ({
          _id: review._id,
          value: review.value,
        }));

        const prompt = `
          Based on the list of reviews, extract the 5 most important action items for the next week. Each action item should include an explanation with references and ids from the list of reviews. Provide the result in a list with JSON format: {"value": string, "reason": string}.
          Reviews:
          ${JSON.stringify(minialLastWeekReviews)}}
        `;

        this.logger.info(`Generating action items with Openai for client: ${request.client.businessId}...`);
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert analyst.' },
            { role: 'user', content: prompt },
          ],
        });
        const actionItems: IActionItem[] = z.array(IActionItemSchema).parse(response.choices[0].message.content);
        this.logger.info(`Generated action items: ${JSON.stringify(actionItems)}`);

        await weeklyActionItemsModel.create({
          actionItems,
          date: requestDate,
          businessId: request.client.businessId,
        });

        this.kafkaConsumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
      },
    });
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const brokers = config.brokers.split(',');

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
