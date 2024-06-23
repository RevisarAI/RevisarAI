import { createFileRoute, redirect } from '@tanstack/react-router';
import { Grid } from '@mui/material';
import Navbar from '@/components/Navbar';

const SiteLayout: React.FC = () => {
  return (
    <Grid container>
      <Grid container item md={3} height="100vh">
        <Navbar/>
        </Grid>
        <Grid>
        <div>navbar etc...</div>
        </Grid>
    </Grid>
  );
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
