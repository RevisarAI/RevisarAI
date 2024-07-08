import OpenAI from 'openai';
import { IRawReview, IReview, IReviewAnalaysis, IReviewAnalysisSchema } from 'shared-types';
import createLogger from 'revisar-server-utils/logger';
import reviewModel from './models/review.model';

import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import config from './config';
import { systemPrompts } from './openai.utils';
import { ChatCompletionMessageParam } from 'openai/resources';

export class ReviewsConsumer {
  private kafkaConsumer: Consumer;
  private logger: ReturnType<typeof createLogger>;
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

        const review: IRawReview = JSON.parse(message.value!.toString());
        const formattedSystemPrompts: ChatCompletionMessageParam[] = systemPrompts.map((prompt) => ({
          role: 'system',
          content: `#${prompt.title.toUpperCase()}:\n${prompt.content}`,
        }));
        this.logger.info(`Sending review to Openai... Review: ${review.value}`);

        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            ...formattedSystemPrompts,
            { role: 'user', content: message.value!.toString() },
            {
              role: 'system',
              content:
                'Output in JSON, keep strings in lowercase: { "sentiment": "sentiment_value", "rating": rating_value, "importance": importance_rating, "phrases": [quotes] }',
            },
          ],
        });

        const reviewAnalysis: IReviewAnalaysis = IReviewAnalysisSchema.parse(
          JSON.parse(response.choices[0].message.content!)
        );

        this.logger.info(
          `Received analysis from Openai... Sentiment: ${reviewAnalysis.sentiment}, Rating: ${reviewAnalysis.rating}`
        );
        const reviewWithAnalysis: IReview = { ...review, ...reviewAnalysis };

        if (reviewAnalysis.phrases.some((phrase) => !review.value.toLocaleLowerCase().includes(phrase))) {
          this.logger.error('######################################');
          this.logger.error(`PHRASES NOT FOUND IN THE REVIEW: ${reviewAnalysis.phrases}`);
          this.logger.error('######################################');
        }
        await reviewModel.create(reviewWithAnalysis);

        this.kafkaConsumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
      },
    });
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const brokers = config.kafkaBrokers.split(',');

    const kafka = new Kafka({
      clientId: 'reviews-loader',
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
