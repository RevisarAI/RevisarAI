import mongoose from "mongoose";

export interface IReview {
  businessId: string;
  value: string;
  date: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
  businessId: { type: String, required: true },
  value: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.model<IReview>("Review", reviewSchema);
