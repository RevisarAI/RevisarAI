import { Skeleton, Stack, TableCell, TableRow } from '@mui/material';
import { range } from 'lodash';

interface TableRowSkeletonProps {
  height: number;
}

const randomTextLineWidth = () => `${Math.floor(Math.random() * 40) + 60}%`;

const TableRowSkeleton = ({ height }: TableRowSkeletonProps) => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="rectangular" height={`${height / 1.5}vh`} width="80%" />
      </TableCell>
      <TableCell>
        <Stack spacing={1} flexGrow={1}>
          {range(Math.floor(Math.random() * 4) + 2).map(() => (
            <Skeleton variant="rectangular" height={20} width={randomTextLineWidth()} />
          ))}
        </Stack>
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" height={`${height / 1.5}vh`} width="100%" />
      </TableCell>
      <TableCell>
        <Skeleton variant="circular" height={`${height}vh`} width={`${height}vh`} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" height={`${height / 2.5}vh`} width="80%" />
      </TableCell>
    </TableRow>
  );
};

export default TableRowSkeleton;
