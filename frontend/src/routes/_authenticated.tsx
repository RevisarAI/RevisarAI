import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { Grid, Typography } from '@mui/material';
import Navbar from '@/components/Navbar';

const SiteLayout: React.FC = () => {
  return (
    <Grid container spacing={'2vw'}>
      <Grid container item md={3} height="100vh">
        <Navbar/>
        </Grid>
        <Grid container item md={9} sx={{ backgroundColor: 'primary.light'}} direction="column" justifyContent="flex-start">
          <Grid item sx={{marginTop: '3vh', marginBottom: '3vh'}}><Typography sx={{fontWeight: 'lighter'}}>Page name</Typography></Grid>
          <Grid item><Outlet/></Grid>
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
