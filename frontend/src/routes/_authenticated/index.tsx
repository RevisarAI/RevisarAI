import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: () => <Navigate to="/home" />,
});
