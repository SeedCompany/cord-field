import { ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import React, { cloneElement, FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TitleProvider } from './components/title';
import { Root } from './scenes/Root';
import { createTheme } from './theme';
import { apolloClient } from './util/apolloClient';

const theme = createTheme();

/**
 * Register all providers here in a flat list
 * This prevents git diff churning
 */
const providers = [
  <ApolloProvider client={apolloClient} children={<></>} />,
  <ThemeProvider theme={theme} children={<></>} />,
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
