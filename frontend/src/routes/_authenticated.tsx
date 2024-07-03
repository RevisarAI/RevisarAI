import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import { isEmpty } from 'validator';

const SiteLayout: React.FC = () => (
  <Grid container>
    <Grid container item md={3} height="100vh">
      <Navbar />
    </Grid>
    <Grid
      container
      item
      md={9}
      padding={'2vw'}
      sx={{ backgroundColor: 'primary.light' }}
      direction="column"
      justifyContent="flex-start"
    >
      <Grid item>
        <Outlet />
      </Grid>
    </Grid>
  </Grid>
);

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    } else if (isEmpty(context.auth.user!.businessName) || isEmpty(context.auth.user!.businessDescription)) {
      throw redirect({
        to: '/register',
        search: {
          redirect: location.href,
          googleSignIn: true,
        },
      });
    }
  },
  component: SiteLayout,
});
