import reviewsModel, { IReview } from "../models/reviewsModel";

class ReviewsController {
  async post(req, res) {
    let { businessId } = req.body;
    let { reviews } = req.body;
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

export default new ReviewsController();