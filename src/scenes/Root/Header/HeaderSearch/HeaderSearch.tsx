import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { makeQueryHandler, StringParam } from '../../../../hooks';

export const useSearch = makeQueryHandler({
  searchValue: StringParam,
});

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    maxWidth: 500,
    marginRight: spacing(3),
  },
  input: {
    background: palette.background.paper,
  },
}));

export const HeaderSearch: FC = () => {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearch();
  const searchValue = searchParams.searchValue ?? '';

  return (
    <TextField
      value={searchValue}
      variant="outlined"
      className={classes.root}
      placeholder="Projects, Languages, Locations, People"
      size="small"
      onChange={(e) => {
        // TODO this should also navigate to search page if not already there but currently just trying to get
        // setSearchParams to not redirect page to /
        setSearchParams({ searchValue: e.target.value });
      }}
      InputProps={{
        className: classes.input,
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};
