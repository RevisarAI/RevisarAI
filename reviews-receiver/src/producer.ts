import { IRawReview } from 'shared-types';
import { Producer, Kafka } from 'kafkajs';
import winston from 'winston';
import createLogger from './utils/logger';
import config from './config';

class ReviewsProducer {
  private kafkaProducer: Producer;
  private logger: winston.Logger;

  public constructor() {
    this.kafkaProducer = this.createKafkaProducer();
    this.logger = createLogger('producer');
  }

  private createKafkaProducer(): Producer {
    const brokers = config.kafka_brokers?.split(',') || ['localhost:9094'];

    const kafka = new Kafka({
      clientId: 'reviews-receiver',
      brokers,
      retry:
        process.env.NODE_ENV === 'production'
          ? { initialRetryTime: 100, retries: 8 }
          : { initialRetryTime: 300, retries: 2 },
    });
    const producer = kafka.producer();
    return producer;
  }

  public async produce(reviews: IRawReview[]): Promise<void> {
    try {
      await this.kafkaProducer.connect();
      await this.kafkaProducer.send({
        topic: 'reviews',
        messages: reviews.map((review) => ({
          value: JSON.stringify(review),
        })),
      });

      this.logger.info(`Sent ${reviews.length} messages successfully`);
    } catch (error) {
      this.logger.error('Failed to send messages', error);
      throw error;
    } finally {
      await this.kafkaProducer.disconnect().catch((error) => {
        this.logger.error('Failed to disconnect from Kafka', error);
      });
    }
  }
}

export default ReviewsProducer;
