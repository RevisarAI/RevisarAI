import { Grid, IconButton, Paper, Typography } from '@mui/material';
import ReviewsSearchBar from '@/components/reviews/SearchBar';
import { useState } from 'react';
import { Tune as TuneIcon } from '@mui/icons-material';

const ReviewsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  return (
    <>
      <Grid container direction="column" rowSpacing={2}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Reviews
          </Typography>
        </Grid>
        <Grid item>
          <Paper square={false}>
            <Grid padding={2} container direction="column" height="85vh">
              <Grid item md={1} container direction="row" alignItems="center" justifyContent="start">
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
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ReviewsPage;
