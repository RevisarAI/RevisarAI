import { createFileRoute, redirect } from '@tanstack/react-router';

const SiteLayout: React.FC = () => {
  return <div>navbar etc...</div>;
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: SiteLayout,
});
