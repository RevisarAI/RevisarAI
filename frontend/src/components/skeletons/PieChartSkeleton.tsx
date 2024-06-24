import { Skeleton, Stack } from '@mui/material';
interface PieChartSkeletonProps {
  height: number;
}
const PieChartSkeleton = ({ height }: PieChartSkeletonProps) => {
  return (
    <Stack direction={'row'} width={'100%'} spacing={'3vw'} padding={2.25} alignItems={'center'}>
      <Skeleton variant="circular" height={height - 20} width={height - 20} />
      <Stack direction={'column'} flexGrow={1} spacing={3}>
        <Skeleton variant="rectangular" height={20} width={'80%'} />
        <Skeleton variant="rectangular" height={20} width={'80%'} />
        <Skeleton variant="rectangular" height={20} width={'80%'} />
        <Skeleton variant="rectangular" height={20} width={'80%'} />
      </Stack>
    </Stack>
  );
};

export default PieChartSkeleton;
