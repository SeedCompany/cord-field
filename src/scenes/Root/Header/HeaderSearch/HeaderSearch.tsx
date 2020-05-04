import { InputAdornment, makeStyles, OutlinedInput } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: '550px',
  },
  input: {
    padding: '12px',
  },
}));

export const HeaderSearch: FC = () => {
  const classes = useStyles();

  return (
    <OutlinedInput
      classes={{
        root: classes.root,
        input: classes.input,
      }}
      id="input-search"
      placeholder="Projects, Languages, Regions, People"
      startAdornment={
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      }
    />
  );
};
