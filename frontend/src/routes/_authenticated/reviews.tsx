import ReviewsPage from '@/pages/reviews';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/reviews')({
  component: ReviewsPage,
});
