import { Grid, Skeleton, Stack } from '@mui/material';

interface WordCloudSkeletonProps {
  height: number;
}
const WordCloudSkeleton = ({ height }: WordCloudSkeletonProps) => {
  const skeletons = Array.from({ length: 5 }).map((_, index) => {
    const cols = Math.random() * 8 + 2;
    return (
      <Grid container item key={index} spacing={3} direction={'row'}>
        <Grid item md={cols}>
          <Skeleton variant="text" height={50} />
        </Grid>
        <Grid item md={12 - cols}>
          <Skeleton variant="text" height={50} />
        </Grid>
      </Grid>
    );
  });

  return (
    <Stack direction={'column'} height={height - 12} padding={2}>
      {skeletons}
    </Stack>
  );
};

export default WordCloudSkeleton;