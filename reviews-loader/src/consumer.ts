import OpenAI from 'openai';
import { IRawReview, IReview, IReviewAnalaysis } from 'shared-types';
import createLogger from 'revisar-server-utils/logger';
import reviewModel from './models/review.model';

import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';

export class ReviewsConsumer {
  private kafkaConsumer: Consumer;
  private logger: ReturnType<typeof createLogger>;
  private openai: OpenAI;

  public constructor() {
    this.kafkaConsumer = this.createKafkaConsumer();
    this.logger = createLogger('consumer');
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  public async startConsumer(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topic: 'reviews', fromBeginning: false });

    await this.kafkaConsumer.run({
      autoCommit: false,
      eachMessage: async (messagePayload: EachMessagePayload) => {
        const { topic, partition, message } = messagePayload;
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        this.logger.info(`- ${prefix} ${message.key}#${message.value}`);

        const review: IRawReview = JSON.parse(message.value!.toString());
        this.logger.info(`Sending review to Openai... Review: ${review.value}`);
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You analyze reviews. Read the review, determine the sentiment (positive, negative, or neutral), provide a rating out of 10, and extract concise, relevant phrases that succinctly explain the sentiment exactly as they appear in the review. Only use phrases that are verbatim from the review text without rephrasing or summarizing. In the phrases, use as few words as possible, if possible even just a couple of keywords. Consider the overall tone, language used, and any specific praises or criticisms mentioned. In addition add importance rating between 0 to 100 - the rating is based on importance and the potential for generating actionable items from the review. Be as specific as possible.',
            },
            { role: 'user', content: message.value!.toString() },
            {
              role: 'system',
              content:
                'Output in JSON: { "sentiment": "sentiment_value", "rating": rating_value, "importance": "importance_rating", "phrases": [...] }',
            },
          ],
        });

        const reviewAnalysis: IReviewAnalaysis = JSON.parse(response.choices[0].message.content!);

        this.logger.info(
          `Received analysis from Openai... Sentiment: ${reviewAnalysis.sentiment}, Rating: ${reviewAnalysis.rating}`
        );
        const reviewWithAnalysis: IReview = { ...review, ...reviewAnalysis };
        await reviewModel.create(reviewWithAnalysis);

        this.kafkaConsumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
      },
    });
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9094'];

    const kafka = new Kafka({
      clientId: 'reviews-loader',
      brokers,
      retry:
        process.env.NODE_ENV === 'production'
          ? { initialRetryTime: 100, retries: 8 }
          : { initialRetryTime: 300, retries: 2 },
    });
    const consumer = kafka.consumer({ groupId: 'review-analysis-group' });
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
