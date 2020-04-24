import { ApolloProvider } from '@apollo/client';
import LuxonUtils from '@date-io/luxon';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/pickers';
import { SnackbarProvider } from 'notistack';
import React, { cloneElement, FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { apolloClient } from './api';
import { SessionProvider } from './components/Session';
import { TitleProvider } from './components/title';
import { Root } from './scenes/Root';
import { createTheme } from './theme';

const theme = createTheme();

/**
 * Register all providers here in a flat list
 * This prevents git diff churning
 */
const providers = [
  <SnackbarProvider children={<></>} />,
  <ApolloProvider client={apolloClient} children={<></>} />,
  <ThemeProvider theme={theme} children={<></>} />,
  <LocalizationProvider dateAdapter={LuxonUtils} children={<></>} />,
  <SessionProvider />,
  <BrowserRouter />,
  <TitleProvider title="CORD Field" />,
];

export const App = () => (
  <Nest elements={providers}>
    <CssBaseline />
    <Root />
  </Nest>
);

const Nest: FC<{ elements: ReactElement[] }> = ({ elements, children }) =>
  elements.reduceRight(
    (out, element) => cloneElement(element, {}, out),
    <>{children}</>
  );
