import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';

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

  return (
    <TextField
      variant="outlined"
      className={classes.root}
      placeholder="Projects, Languages, Locations, People"
      size="small"
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
