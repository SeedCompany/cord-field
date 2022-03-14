import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CreateDialogProviders } from './Creates';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    display: 'flex',
    height: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const MainLayout = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CreateDialogProviders>
        <Sidebar />
      </CreateDialogProviders>
      <div className={classes.main}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};
