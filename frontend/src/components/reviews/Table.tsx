import React from 'react';
import { IReview } from 'shared-types';
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import HighlightedText from './HighlightedText';
import TableRowSkeleton from '../skeletons/TableRowSkeleton';
import { range } from 'lodash';

export interface Column {
  id: keyof Pick<IReview, 'rating' | 'value' | 'sentiment' | 'dataSource'> | 'actions';
  label: string;
  minWidth: number;
  align?: 'right' | 'center' | 'left';
  render: (value: any, review: IReview) => JSX.Element;
}

export const SentimentText: Column['render'] = (value: IReview['value'], { phrases, sentiment }: IReview) => {
  let lastIndex = 0;

  return (
    <Typography>
      {phrases.map((phrase) => {
        const index = value.toLowerCase().indexOf(phrase.toLowerCase());
        if (index >= 0) {
          const val = (
            <span key={index}>
              {value.substring(lastIndex, index)}
              <HighlightedText key={index} text={value.substring(index, index + phrase.length)} sentiment={sentiment} />
            </span>
          );
          lastIndex = index + phrase.length;
          return val;
        }
      })}
      {value.substring(lastIndex)}
    </Typography>
  );
};

interface ReviewsTableProps {
  rows: IReview[];
  page: number;
  columns: readonly Column[];
  loading?: boolean;
  count?: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({
  rows,
  columns,
  loading = false,
  rowsPerPage,
  count = -1,
  onPageChange,
  page,
}) => {
  return (
    <Paper sx={{ maxHeight: 'inherit', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Stack height="100%" direction="column" justifyContent="space-between">
        <TableContainer style={{ height: '90%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: `${column.minWidth}vh` }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? range(10).map((index) => <TableRowSkeleton key={index} height={10} />)
                : rows.map((row) => (
                    <TableRow hover key={row._id?.toString()}>
                      {columns.map((column) => {
                        const value = row[column.id !== 'actions' ? column.id : 'value'];
                        return (
                          <TableCell key={`${row._id!}-${column.id}`} align={column.align}>
                            {column.render(value, row)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count}
          rowsPerPageOptions={[rowsPerPage]}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
        />
      </Stack>
    </Paper>
  );
};

export default ReviewsTable;
