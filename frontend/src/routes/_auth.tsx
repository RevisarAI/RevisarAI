import { Grid } from '@mui/material';
import AuthBlobs from '../components/AuthBlobs.tsx';
import { Outlet, createFileRoute } from '@tanstack/react-router';

const AuthLayout: React.FC = () => {
  return (
      <Grid container>
      <Grid xs={6}>
        <Outlet />
        </Grid>
      <Grid xs={6}>
          <AuthBlobs/>
        </Grid>
      </Grid>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
