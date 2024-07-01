import CustomizePage from '@/pages/customize';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/customize')({
  component: CustomizePage,
});
