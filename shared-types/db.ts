export const ReviewMongoseSchema = {
  name: 'Review',
  schema: {
    value: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    phrases: {
      type: [String],
      required: true,
    },
    dataSource: {
      type: String,
      required: true,
    },
    importance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
};
