import React, { CSSProperties } from 'react';
import { DataSourceEnum, IReview, SentimentEnum } from 'shared-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

interface Column {
  id: keyof Pick<IReview, 'rating' | 'value' | 'sentiment' | 'dataSource'>;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  render?: (value: any, review: IReview) => JSX.Element;
  // | ((value: number) => JSX.Element)
  // | ((value: string, review: IReview) => JSX.Element)
  // | ((value: SentimentEnum) => JSX.Element)
  // | ((value: DataSourceEnum) => JSX.Element);
}

const sentimentColors: Record<SentimentEnum, Record<'border' | 'fill', string>> = {
  positive: {
    fill: '#c2ffc2',
    border: '#9ad69a',
  },
  negative: {
    fill: '#fae3e3',
    border: '#af6863',
  },
  neutral: {
    fill: '#faf2d3',
    border: '#e0cd80',
  },
};

const HighlightedText: React.FC<{ text: string; sentiment: SentimentEnum; style?: CSSProperties }> = ({
  text,
  sentiment,
  style = {},
}) => (
  <span
    style={{
      paddingRight: '0.25rem',
      paddingLeft: '0.25rem',
      borderColor: sentimentColors[sentiment].border,
      borderWidth: '0.1rem',
      borderStyle: 'solid',
      backgroundColor: sentimentColors[sentiment].fill,
      borderRadius: '0.5rem',
      ...style,
    }}
  >
    {text}
  </span>
);

const renderSentimentText: Column['render'] = (value: IReview['value'], { phrases, sentiment }: IReview) => {
  let lastIndex = 0;
  return (
    <Typography>
      {phrases.map((phrase) => {
        let index = value.toLowerCase().indexOf(phrase.toLowerCase());
        if (index >= 0) {
          // Push preceding text if any
          const val = (
            <span>
              {index > lastIndex && <span key={lastIndex}>{value.substring(lastIndex, index)}</span>}
              <HighlightedText key={index} text={value.substring(index, index + phrase.length)} sentiment={sentiment} />
            </span>
          );
          lastIndex = index + phrase.length;
          return val;
        }
      })}
      <span>{value.substring(lastIndex)}</span>
    </Typography>
  );
};

const columns: readonly Column[] = [
  {
    id: 'rating',
    label: 'Rating',
    render: (value: IReview['rating']) => <Typography variant="body1">{value}/10</Typography>,
  },
  {
    id: 'value',
    label: 'Text',
    render: renderSentimentText,
  },
  {
    id: 'sentiment',
    label: 'Sentiment',
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
    render: (value: IReview['dataSource']) => <Typography variant="body1">{value}</Typography>,
  },
];

interface ReviewsTableProps {
  reviews: IReview[];
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={`${row._id?.toString()} ${i}`}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={`${column.id}${i}`} align={column.align}>
                        {column.render ? column.render(value, row) : value}
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
        count={reviews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ReviewsTable;
