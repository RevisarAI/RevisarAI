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
            <>
              {value.substring(lastIndex, index)}
              <HighlightedText key={index} text={value.substring(index, index + phrase.length)} sentiment={sentiment} />
            </>
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
  columns: readonly Column[];
  loading?: boolean;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ rows, columns, loading = false }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
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
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
    </Paper>
  );
};

export default ReviewsTable;
