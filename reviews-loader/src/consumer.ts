import OpenAI from 'openai';
import { IRawReview, IReview, IReviewAnalaysis, IReviewAnalysisSchema } from 'shared-types';
import createLogger from 'revisar-server-utils/logger';
import reviewModel from './models/review.model';

import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import config from './config';

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
        const systemPrompt = `Context:
You are a professional customer reviews analyst.
You are hired by a company to analyze their customer reviews and provide a detailed analysis of each review.
Input:
A text which contains a customer review of a product or service provided by the company.
Goals:
1. Determine the review's sentiment (positive, negative, or neutral).
2. Provide an overall rating on the scale of 1-10.
3. Extract concise and relevant phrases that succinctly explain the sentiment exactly as they appear in the review.
4. Rate the review's importance on a scale of 0-100 based on the importance and potential for generating actionable items based on it.
General Considerations:
1. Consider the overall tone, language used, and any specific praises or criticisms mentioned in the review.
2. Be as specific as possible
Instructions for phrases extraction:
1. Each phrase is a single sentence or clause that is directly taken from the review letter by letter. It must be verbatim from the review text and contain an exact piece of the review without skipping a letter. 
2. A phrase cannot combine multiple "pieces" of the review into one phrase. multiple "pieces" shall be considered separate phrases.
3. In the phrases, use as few words as possible, with up to 8 words, just a couple of keywords if possible.
4. If an extracted phrase ends with a comma or period, you can remove the end punctuation.`;
        this.logger.info(`Sending review to Openai... Review: ${review.value}`);
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            { role: 'user', content: message.value!.toString() },
            {
              role: 'system',
              content:
                'Output in JSON: { "sentiment": "sentiment_value", "rating": rating_value, "importance": "importance_rating", "phrases": [...] }',
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
