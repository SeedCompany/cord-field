import LuxonUtils from '@date-io/luxon';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/pickers';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './api';
import { Nest } from './components/Nest';
import { SessionProvider } from './components/Session';
import { SnackbarProvider } from './components/Snackbar';
import { TitleProvider } from './components/title';
import { Root } from './scenes/Root';
import { createTheme } from './theme';

const theme = createTheme();

/**
 * Register all providers here in a flat list
 * This prevents git diff churning
 * Order still matters (the first is the outer most component)
 */
const providers = [
  <BrowserRouter />,
  <TitleProvider title="CORD Field" />,
  <ThemeProvider theme={theme} children={<></>} />,
  <LocalizationProvider dateAdapter={LuxonUtils} children={<></>} />,
  <SnackbarProvider />,
  <ApolloProvider />,
  <SessionProvider />,
];

export const App = () => (
  <Nest elements={providers}>
    <CssBaseline />
    <Root />
  </Nest>
);
