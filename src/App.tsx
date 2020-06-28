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
import { UploadManagerProvider, UploadProvider } from './components/Upload';
import { Root } from './scenes/Root';
import { createTheme } from './theme';

const theme = createTheme();

/**
 * Register all app providers here in a flat list.
 * These are used client-side, server-side, and in storybook.
 * This prevents git diff churning
 * Order still matters (the first is the outer most component)
 */
export const appProviders = [
  <TitleProvider title="CORD Field" />,
  <ThemeProvider theme={theme} children={<></>} />,
  <CssBaseline />,
  <LocalizationProvider dateAdapter={LuxonUtils} children={<></>} />,
  <SnackbarProvider />,
  <ApolloProvider />,
  <SessionProvider />,
  <UploadManagerProvider />,
  <UploadProvider />,
];

// Only providers that should run client-side. No storybook or server-side.
const clientProviders = [
  <BrowserRouter />, // router is unique per context
  ...appProviders,
];

export const App = () => (
  <Nest elements={clientProviders}>
    <Root />
  </Nest>
);
