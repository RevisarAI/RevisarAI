import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '@/pages/auth/login';
import z from 'zod';

export const Route = createFileRoute('/_auth/login')({
  validateSearch: z.object({ redirect: z.string().catch('/') }),
  component: LoginPage,
});
