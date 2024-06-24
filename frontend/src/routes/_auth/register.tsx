import { createFileRoute } from '@tanstack/react-router';
import RegisterPage from '@/pages/auth/register';
import { z } from 'zod';

export const Route = createFileRoute('/_auth/register')({
  validateSearch: z.object({ redirect: z.string().catch('/'), googleSignIn: z.boolean().optional().catch(false) }),
  component: RegisterPage,
});
