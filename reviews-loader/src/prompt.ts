import { Schema, z } from 'zod';
import { OpenAI } from 'openai';
import { SentimentEnum } from 'shared-types';

// Chain-of-Thought
// Few-Shots
// Prompt Chaining
interface Prompt<T> {
  outputSchema: Schema<T>;
  messages: OpenAI.ChatCompletionMessageParam[];
  topP: number;
}

const SentimentRatingResponseSchema = z.object({ sentiment: z.nativeEnum(SentimentEnum), rating: z.number() });

export const getSentimentRatingPrompt = (review: string): Prompt<z.infer<typeof SentimentRatingResponseSchema>> => {
  const systemContent = `
You are an AI that analyzes reviews. First, identify the sentiment (positive, neutral, negative) and rating from 1-10 of the following review.

Examples:
I: The system seems interesting, but it's a bit too early to tell how effective it will be. I'm waiting to see more functionalities before I can really recommend it.
O: { "sentiment": "neutral", rating: 5 }
  
I: This platform is a game-changer! Having all my customer reviews in one place with clear insights is fantastic. The sentiment analysis helped me identify areas to improve, and the action items are super helpful. Highly recommend!
O: { "sentiment": "positive", rating: 9 }
  
I: The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.
O: { "sentiment": "negative", rating: 3 }
`;

  const userContent = `
Review: ${review}
`;
  return {
    outputSchema: SentimentRatingResponseSchema,
    messages: [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
    topP: 1,
  };
};

const PhrasesResponseSchema = z.array(z.string());
export const getPhrasesPrompt = (
  review: string,
  sentiment: SentimentEnum
): Prompt<z.infer<typeof PhrasesResponseSchema>> => {
  const systemContent = `
Based on the following review, extract key phrases exactly as they appear in the review. These phrases should represent the sentiment and overall importance of the review.

Examples:
I: The food was delicious. I enjoyed everything in the meal and it was one of the best experiences I had in my life
O: ["food was delicious", "one of the best experiences"]

I: The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.
O: ["hit-or-miss", "Some of the insights were spot-on but others felt off base", "pricing seems a bit high"]
`;

  const userContent = `
Review: ${review}
Sentiment: ${sentiment}
`;
  return {
    outputSchema: PhrasesResponseSchema,
    messages: [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
    topP: 0.75,
  };
};

const ImportanceResponseSchema = z.number();
export const getImportancePrompt = (
  review: string,
  sentiment: SentimentEnum
): Prompt<z.infer<typeof ImportanceResponseSchema>> => {
  const systemContent = `
You are a critics system. Based on the review, determine the importance based on the possibility to create a meaningful action item from it. 
A meaningful action item is a task the business needs to do to in order to improve it's reviews. Thus, most of the times negative reviews will be of high importance and positive reviews will be of low importance.
Rate the importance on a scale of 1-10 and solely return the number.
`;

  const userContent = `
Review: ${review}
Sentiment: ${sentiment}
`;

  return {
    outputSchema: ImportanceResponseSchema,
    messages: [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
    topP: 1,
  };
};
