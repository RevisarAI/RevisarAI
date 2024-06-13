import reviewsModel, { IReview } from "../models/reviewsModel";

class BatchController {
  async post(req, res) {
    let { businessId, reviews } = req.body;
    reviews = reviews.map((review) => {
      return {
        ...review,
        businessId,
      };
    });
     
    try {
      await reviewsModel.insertMany(reviews);
      res.status(201).send();
    } catch (err) {
      res.status(500).send();
    }
  }
}

export default new BatchController();
