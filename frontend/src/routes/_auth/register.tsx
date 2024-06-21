import { createFileRoute } from '@tanstack/react-router';
import RegisterPage from '@/pages/auth/register';

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
});
