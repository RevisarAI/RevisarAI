import { Skeleton, Stack, TableCell, TableRow } from '@mui/material';
import { range } from 'lodash';

interface ActionItemSkeletonProps {
  height: number;
}

const randomTextLineWidth = () => `${Math.floor(Math.random() * 5) + 100}%`;

const ActionItemSkeleton = ({ height }: ActionItemSkeletonProps) => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="rectangular" height={`${height}vh`} width="100%" />
      </TableCell>
      <TableCell>
        <Stack spacing={1} flexGrow={1}>
          {range(Math.floor(Math.random() * 4) + 2).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={5} width={randomTextLineWidth()} />
          ))}
        </Stack>
      </TableCell>

    </TableRow>
  );
};

export default ActionItemSkeleton;
