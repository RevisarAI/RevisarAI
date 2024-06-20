import { Types as mongooseTypes } from 'mongoose';

declare namespace sharedTypes {
  interface UserTokens {
    accessToken: string;
    refreshToken: string;
  }

  interface ILoginFormData {
    email: string;
    password: string;
    remember: boolean;
  }

  export interface IUser {
    _id?: mongooseTypes.ObjectId;
    email: string;
    password: string;
    fullName: string;
    businessName: string;
    businessDesc: string;
    refreshTokens?: string[];
  }

  export type IUserDetails = Pick<IUser, '_id' | 'email' | 'fullName' | 'businessName'>;
}

export = sharedTypes;
