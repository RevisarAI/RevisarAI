import { Grid, IconButton, Paper, Typography } from '@mui/material';
import ReviewsSearchBar from '@/components/reviews/SearchBar';
import { useState } from 'react';
import { Tune as TuneIcon } from '@mui/icons-material';
import { DataSourceEnum, IReview, SentimentEnum } from 'shared-types';
import ReviewsTable from '@/components/reviews/Table';
import { range } from 'lodash';

const staticReview: IReview = {
  _id: '6676fb5e6f4000161b4c276b',
  value:
    'This platform is a game-changer! Having all my customer reviews in one place with clear insights is fantastic. The sentiment analysis helped me identify areas to improve, and the action items are super helpful. Highly recommend!',
  date: new Date('2024-06-21T16:22:36.562Z'),
  businessId: '56d4cc71-f5b4-4df8-9d31-8d09218ecbdb',
  sentiment: SentimentEnum.POSITIVE,
  rating: 9,
  phrases: [
    'game-changer',
    'clear insights',
    'helped me identify areas to improve',
    'action items are super helpful',
    'highly recommend',
  ],
  dataSource: DataSourceEnum.GOOGLE,
};

const generateReview = (review: IReview): IReview => ({
  ...review,
  sentiment: Object.values(SentimentEnum)[Math.floor(Math.random() * 3)],
  dataSource: Object.values(DataSourceEnum)[Math.floor(Math.random() * 3)],
});

const staticReviews: IReview[] = [
  { ...staticReview, value: 'yes game-changer' },
  ...range(30).map(() => generateReview(staticReview)),
];

const ReviewsPage: React.FC = () => {
  const paperHeightVH = 85;
  const [search, setSearch] = useState('');

  return (
    <>
      <Grid container direction="column" rowSpacing={4}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Reviews
          </Typography>
        </Grid>
        <Grid item>
          <Paper square={false}>
            <Grid padding={2} container direction="column" height={`${paperHeightVH}vh`} justifyContent="space-evenly">
              <Grid
                item
                md={1}
                style={{ maxHeight: `${paperHeightVH * 0.1}vh` }}
                container
                direction="row"
                alignItems="center"
                justifyContent="start"
              >
                <Grid item md={8}>
                  <ReviewsSearchBar value={search} onChange={setSearch} />
                </Grid>
                <Grid item md={1} textAlign="center">
                  {/* TODO: implement filter logic */}
                  <IconButton disabled>
                    <TuneIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item md={10} style={{ maxHeight: `${paperHeightVH * 0.8}vh` }}>
                <ReviewsTable reviews={staticReviews.filter((r) => r.value.includes(search))} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ReviewsPage;
