import { useAuth } from '@/utils/auth-context';
import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/review-service';
import SentimentOverTimePanel from '@/components/panels/SentimentOverTimePanel';
import DataSourceDistributionPanel from '@/components/panels/DataSourceDistributionPanel';
import WordCloudPanel from '@/components/panels/WordCloudPanel';
import WeeklyActionItemsPanel from '@/components/panels/actionitems/WeeklyActionItemsPanel';
import { actionItemsService } from '@/services/action-items-service';
import { IActionItem } from 'shared-types';

const HomePage: React.FC = () => {
  const auth = useAuth();
  const { data, status } = useQuery({
    queryKey: ['businessAnalysis'],
    queryFn: ({ signal }) => reviewService.getBusinessAnalysis({ signal }),
  });
  const actionItemsQuery = useQuery({
    queryKey: ['weeklyActionItems'],
    queryFn: () => actionItemsService.getWeeklyActionItems(),
    notifyOnChangeProps: 'all',
  });

  const updateActionItemStatus = async (item: IActionItem, itemsID: string) => {
    item.isCompleted = !item.isCompleted;
    await actionItemsService.updateActionItemStatus(item, itemsID);
    actionItemsQuery.refetch();
  };

  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Welcome back, {auth.user?.fullName.split(' ')[0]}
          </Typography>
        </Grid>
        <Grid item container columns={18} spacing={2}>
          <Grid item md={7}>
            <DataSourceDistributionPanel
              height={200}
              data={status == 'success' ? data.dataSourceDistribution : []}
              loading={status == 'pending'}
            />
          </Grid>
          <Grid item md={11}>
            <SentimentOverTimePanel
              height={200}
              data={status == 'success' ? data.sentimentOverTime : []}
              loading={status == 'pending'}
            />
          </Grid>
        </Grid>
        <Grid item container columns={18} spacing={2}>
          <Grid item md={11}>
            <WeeklyActionItemsPanel
              height={295}
              data={actionItemsQuery.status == 'success' ? actionItemsQuery.data.actionItems : []}
              itemsID={
                actionItemsQuery.status == 'success' && actionItemsQuery.data._id
                  ? actionItemsQuery.data._id.toString()
                  : ''
              }
              updateActionItemStatus={updateActionItemStatus}
              loading={actionItemsQuery.status === 'pending'}
            />
          </Grid>
          <Grid item md={7}>
            <WordCloudPanel
              height={250}
              data={status == 'success' ? data.wordsFrequencies : []}
              loading={status == 'pending'}
              colors={['#143059', '#2F6B9A', '#82a6c2']}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
