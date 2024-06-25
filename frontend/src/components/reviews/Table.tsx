import React, { CSSProperties } from 'react';
import { DataSourceEnum, IReview, SentimentEnum } from 'shared-types';
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
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import ApiSvg from '@/assets/Api.svg';
import TripAdvisorSvg from '@/assets/TripAdvisor.svg';
import GoogleSvg from '@/assets/Google.svg';

// TODO: Change this type to interface with 'label', 'icon', 'onClick'
type ReviewAction = (review: IReview) => void;

interface Column {
  id: keyof Pick<IReview, 'rating' | 'value' | 'sentiment' | 'dataSource'> | 'actions';
  label: string;
  minWidth: number;
  align?: 'right' | 'center' | 'left';
  render: (value: any, review: IReview) => JSX.Element;
}

const dataSourceIcons: Record<DataSourceEnum, string> = {
  API: ApiSvg,
  TripAdvisor: TripAdvisorSvg,
  Google: GoogleSvg,
};

const sentimentColors: Record<SentimentEnum, Record<'border' | 'fill', string>> = {
  positive: {
    fill: '#e5eefd',
    border: '#6489bd',
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
      <span>{value.substring(lastIndex)}</span>
    </Typography>
  );
};

const columns: readonly Column[] = [
  {
    id: 'rating',
    label: 'Rating',
    minWidth: 50,
    render: (value: IReview['rating']) => <Typography variant="body1">{value}/10</Typography>,
    align: 'center',
  },
  {
    id: 'value',
    label: 'Text',
    align: 'left',
    minWidth: 900,
    render: renderSentimentText,
  },
  {
    id: 'sentiment',
    label: 'Sentiment',
    align: 'center',
    minWidth: 100,
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
    minWidth: 100,
    render: (value: IReview['dataSource']) => (
      <Tooltip arrow TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} title={value} placement="bottom">
        <img height="60vh" src={dataSourceIcons[value]}></img>
      </Tooltip>
    ),
  },
  {
    id: 'actions',
    label: '',
    align: 'center',
    minWidth: 50,
    render: (onClick: ReviewAction, review: IReview) => 
  },
];

interface ReviewsTableProps {
  reviews: IReview[];
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews }) => {
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
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover key={row._id?.toString()}>
                    {columns.map((column) => {
                      const value = column.id !== 'actions' ? row[column.id] : () => console.log('test');
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
          count={reviews.length}
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
