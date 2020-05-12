import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    maxWidth: 500,
    marginRight: spacing(3),
  },
}));

export const HeaderSearch: FC = () => {
  const classes = useStyles();

  return (
    <TextField
      variant="outlined"
      className={classes.root}
      placeholder="Projects, Languages, Regions, People"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};
