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
}

export = sharedTypes;
