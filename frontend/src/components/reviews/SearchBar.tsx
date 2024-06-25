import React from 'react';
import { Grid, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';

interface ReviewsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const ReviewsSearchBar: React.FC<ReviewsSearchBarProps> = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <Paper square={false} sx={{ borderRadius: '5vh', bgcolor: theme.palette.grey[200] }} component="form">
      <Grid container direction="row" height="5vh" alignItems="center" justifyContent="center" paddingLeft={1}>
        <Grid item md={1}>
          <IconButton aria-label="menu">
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item md={10}>
          <InputBase fullWidth placeholder="Search" value={value} onChange={(e) => onChange(e.target.value)} />
        </Grid>
        <Grid item md={1}>
          <IconButton disabled={value.length == 0} type="button" aria-label="search" onClick={() => onChange('')}>
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReviewsSearchBar;
