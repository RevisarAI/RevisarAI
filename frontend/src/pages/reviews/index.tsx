import { Grid, IconButton, Paper, Stack, Tooltip, Typography, Zoom as ZoomTransition } from '@mui/material';
import ReviewsSearchBar from '@/components/reviews/SearchBar';
import { useMemo, useState } from 'react';
import { Tune as TuneIcon } from '@mui/icons-material';
import { DataSourceEnum, IReview } from 'shared-types';
import ReviewsTable, { Column as ReviewColumn, SentimentText } from '@/components/reviews/Table';
import { debounce } from 'lodash';
import ApiSvg from '@/assets/Api.svg';
import TripAdvisorSvg from '@/assets/TripAdvisor.svg';
import GoogleSvg from '@/assets/Google.svg';
import HighlightedText from '@/components/reviews/HighlightedText';
import ReviewActions from '@/components/reviews/ReviewActions';
import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/review-service';

const dataSourceIcons: Record<DataSourceEnum, string> = {
  API: ApiSvg,
  TripAdvisor: TripAdvisorSvg,
  Google: GoogleSvg,
};

const columns: readonly ReviewColumn[] = [
  {
    id: 'rating',
    label: 'Rating',
    minWidth: 5,
    render: (value: IReview['rating'], { date }: IReview) => (
      <Tooltip
        arrow
        TransitionComponent={ZoomTransition}
        TransitionProps={{ timeout: 200 }}
        title={
          <Stack direction="column">
            <Typography variant="body2">Review from:</Typography>
            <Typography variant="body2">
              {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}
            </Typography>
          </Stack>
        }
        placement="top"
      >
        <Typography variant="body1">{value}/10</Typography>
      </Tooltip>
    ),
    align: 'center',
  },
  {
    id: 'value',
    label: 'Text',
    align: 'left',
    minWidth: 71,
    render: SentimentText,
  },
  {
    id: 'sentiment',
    label: 'Sentiment',
    align: 'center',
    minWidth: 10,
    render: (value: IReview['sentiment']) => (
      <Typography variant="body1">
        <HighlightedText
          style={{ padding: '0.8rem' }}
          sentiment={value}
          text={`${value.charAt(0).toUpperCase()}${value.slice(1)}`}
        />
      </Typography>
    ),
  },
  {
    id: 'dataSource',
    label: 'Data Source',
    align: 'center',
    minWidth: 10,
    render: (value: IReview['dataSource']) => (
      <Tooltip
        arrow
        TransitionComponent={ZoomTransition}
        TransitionProps={{ timeout: 200 }}
        title={<Typography variant="body2">{value}</Typography>}
        placement="top"
      >
        <img height="50vh" src={dataSourceIcons[value]}></img>
      </Tooltip>
    ),
  },
  {
    id: 'actions',
    label: '',
    align: 'center',
    minWidth: 5,
    render: (reviewText: string) => <ReviewActions reviewText={reviewText} />,
  },
];

const ReviewsPage: React.FC = () => {
  const paperHeightVH = 85;
  const [search, setSearch] = useState('');
  const [totalReviews, setTotalReviews] = useState(-1);
  const [page, setPage] = useState(0);
  const [initialRenderTimestamp] = useState(() => new Date().toISOString());

  const rowsPerPage = 10;

  const query = useInfiniteQuery({
    queryKey: ['reviews', search],
    queryFn: async ({ signal, pageParam = 1 }) => {
      const response = await reviewService.getReviews(
        { page: pageParam, limit: rowsPerPage, before: initialRenderTimestamp, search },
        signal
      );
      setTotalReviews(response.totalReviews);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.reviews.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const handleInputChange = useMemo(
    () =>
      debounce((newValue: string) => {
        // If the search changes, the pages refresh
        setSearch(newValue);
        setPage(0);
      }, 300),
    []
  );

  const { isFetching: loading, isError: error, data, isFetchingNextPage, hasNextPage, fetchNextPage } = query;
  const currentPageResponse = data?.pages[page];

  const handleNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
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
                <ReviewsSearchBar onChange={handleInputChange} disabled={error} />
              </Grid>
              <Grid item md={1} textAlign="center">
                {/* TODO: implement filter logic */}
                <IconButton disabled>
                  <TuneIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item md={10} style={{ maxHeight: `${paperHeightVH * 0.8}vh` }}>
              {error ? (
                <Typography variant="body1">
                  An unknown error occurred. Try to refresh the page or try again later
                </Typography>
              ) : (
                <ReviewsTable
                  loading={loading}
                  columns={columns}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  count={totalReviews}
                  onPageChange={(_, newPage) => {
                    setPage(newPage);
                    if (newPage > data!.pages.length - 1) {
                      handleNextPage();
                    }
                  }}
                  rows={currentPageResponse?.reviews || []}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReviewsPage;
