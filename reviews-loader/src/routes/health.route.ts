import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('The Reviews Loader Kafka consumer is up and running!');
});

export default router;
