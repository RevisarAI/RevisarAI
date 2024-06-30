import React, { useState } from 'react';
import { Grid, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';

interface ReviewsSearchBarProps {
  onChange: (value: string) => void;
}

const ReviewsSearchBar: React.FC<ReviewsSearchBarProps> = ({ onChange }) => {
  const theme = useTheme();
  const [search, setSearch] = useState<string>('');

  const handleSearchInputChange = (value: string) => {
    setSearch(value);
    onChange(value);
  };

  return (
    <Paper square={false} sx={{ borderRadius: '5vh', bgcolor: theme.palette.grey[200] }} component="form">
      <Grid container direction="row" height="5vh" alignItems="center" justifyContent="center" paddingLeft={1}>
        <Grid item md={1}>
          <IconButton aria-label="menu">
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item md={10}>
          <InputBase
            fullWidth
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearchInputChange(e.target.value)}
          />
        </Grid>
        <Grid item md={1}>
          <IconButton
            disabled={search.length == 0}
            type="button"
            aria-label="search"
            onClick={() => handleSearchInputChange('')}
          >
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReviewsSearchBar;
