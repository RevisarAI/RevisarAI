import { Outlet, createFileRoute } from '@tanstack/react-router';

const AuthLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
