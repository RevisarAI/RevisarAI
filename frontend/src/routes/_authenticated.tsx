import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router';

import { Grid, Typography } from '@mui/material';
import Navbar from '@/components/Navbar';
import { isEmpty } from 'validator';

const SiteLayout: React.FC = () => {
  const router = useRouterState();

  return (
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
        <Grid item sx={{ marginTop: '3vh', marginBottom: '3vh' }}>
          <Typography sx={{ fontWeight: 'lighter' }}>
            {router.location.pathname[1] + router.location.pathname.slice(2)}
          </Typography>
        </Grid>
        <Grid item>
          <Outlet />
        </Grid>
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
