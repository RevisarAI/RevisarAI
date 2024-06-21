import { Grid } from '@mui/material';
import AuthBlobs from '../components/AuthBlobs.tsx';
import { Outlet, createFileRoute } from '@tanstack/react-router';

const AuthLayout: React.FC = () => {
  return (
    <Grid container>
      <Grid item md={6} container spacing={0} justifyContent="center">
        <Grid item md={7} container justifyItems="center">
          <Outlet />
        </Grid>
      </Grid>
      <Grid item md={6} container justifyItems="center" height="100vh">
        <Grid item md={12}>
          <AuthBlobs />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
