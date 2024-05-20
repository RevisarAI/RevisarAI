import { BaseConstroller } from "./baseController";
import reviewsModel, { IReview } from "../models/reviewsModel";

class ReviewsController extends BaseConstroller<IReview> {
  async post(req, res) {
    super.post(req, res);
  }
  async postBatch(req, res) {
    super.post(req, res);
  }
}

export default new ReviewsController(reviewsModel);
