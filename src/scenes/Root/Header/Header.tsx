import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(4, 4, 1, 4),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
}));

export const Header = () => {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <HeaderSearch />
      <ProfileToolbar />
    </header>
  );
};
