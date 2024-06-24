import { useAuth } from '@/utils/auth-context';
import { Grid, Typography } from '@mui/material';
import DataSourceDistributionPanel from '@/components/DataSourceDistributionPanel';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/review-service';

const HomePage: React.FC = () => {
  const auth = useAuth();
  const { data, status } = useQuery({
    queryKey: ['businessAnalysis'],
    queryFn: ({ signal }) => reviewService.getBusinessAnalysis({ signal }),
  });

  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Welcome back, {auth.user?.fullName.split(' ')[0]}
          </Typography>
        </Grid>
        <Grid item container columns={18}>
          <Grid item md={7}>
            <DataSourceDistributionPanel
              height={200}
              data={status == 'success' ? data.dataSourceDistribution : []}
              loading={status == 'pending'}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
