import { makeStyles } from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    padding: spacing(4),
    width: '100%',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
}));

export const Header: FC = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <HeaderSearch />
      <ProfileToolbar />
    </header>
  );
};
