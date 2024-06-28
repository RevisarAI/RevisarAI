import { Skeleton, Stack } from '@mui/material';

interface BarChartSkeletonProps {
  height: number;
}

const BarChartSkeleton = ({ height }: BarChartSkeletonProps) => {
  return (
    <Stack direction={'row'} spacing={'3vw'} padding={2.25} justifyContent={'center'}>
      <Stack direction={'row'} height={height - 20} spacing={2} alignItems={'flex-end'}>
        {Array.from({ length: 15 }).map((_, index) => (
          <Skeleton variant="rectangular" height={`${Math.random() * 100 + 15}%`} width={15} key={index} />
        ))}
      </Stack>
    </Stack>
  );
};

export default BarChartSkeleton;
