import { makeStyles, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { Picture } from '../../components/Picture';
import { createTheme } from '../../theme';
import backgroundImg from './background.png';

const useStyles = makeStyles(
  ({ palette }) => ({
    '@global': {
      body: {
        // Here instead of `root` so overscroll doesn't have an abrupt white background.
        backgroundColor: palette.background.default,
      },
    },
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      position: 'relative', // for background
    },
  }),
  {
    index: 1, // Higher specificity than baseline
  }
);

const authTheme = createTheme({ dark: true });

const ThemedLayout = ({ children }: ChildrenProp) => {
  const classes = useStyles(); // has auth theme applied
  return (
    <ThemeProvider theme={authTheme}>
      <div className={classes.root}>
        <Picture lazy background source={backgroundImg} />
        {children ?? <Outlet />}
      </div>
    </ThemeProvider>
  );
};

export const AuthLayout = (props: ChildrenProp) => (
  <ThemeProvider theme={authTheme}>
    <ThemedLayout {...props} />
  </ThemeProvider>
);
