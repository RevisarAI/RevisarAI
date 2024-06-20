import { Grid } from '@mui/material';
import AuthBlobs from '../components/AuthBlobs.tsx';
import { Outlet, createFileRoute } from '@tanstack/react-router';

const AuthLayout: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={6} container spacing={0} direction="row" alignItems="center" justifyContent="center">
        <Grid item xs={7}>
          <Outlet />
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <AuthBlobs />
      </Grid>
    </Grid>
  );
};

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
