import { createFileRoute, redirect } from '@tanstack/react-router';

const SiteLayout: React.FC = () => {
  return <div>navbar etc...</div>;
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // TODO: Redirect only if not authorized
    throw redirect({
      to: '/login',
    });
  },
  component: SiteLayout,
});
