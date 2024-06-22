import { Types as mongooseTypes } from 'mongoose';

declare namespace sharedTypes {
  interface IUserTokens {
    accessToken: string;
    refreshToken: string;
  }

  interface ILoginFormData {
    email: string;
    password: string;
    remember: boolean;
  }

  interface IClient {
    _id?: mongooseTypes.ObjectId;
    email: string;
    fullName: string;
    businessName: string;
    businessDescription: string;
    businessId: string;
    password: string;
    tokens?: string[];
  }

  type IUserDetails = Omit<IClient, '_id' | 'password' | 'tokens'>;

  type ICreateUser = Pick<IClient, 'email' | 'fullName' | 'businessName' | 'businessDescription' | 'password'>;

  interface IRawReview {
    businessId: string;
    value: string;
    date: Date;
  }

  interface IReviewAnalaysis {
    sentiment: string;
    rating: number;
    phrases: string[];
  }
  type IReview = IRawReview & IReviewAnalaysis & { _id?: mongooseTypes.ObjectId };
}

export = sharedTypes;
