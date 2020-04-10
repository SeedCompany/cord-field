import { CssBaseline, ThemeProvider } from '@material-ui/core';
import React, { cloneElement, FC, ReactElement } from 'react';
import { createTheme } from './theme';

const theme = createTheme();

/**
 * Register all providers here in a flat list
 * This prevents git diff churning
 */
const providers = [
  <ThemeProvider theme={theme} children={<></>} />,
  // more
];

export const App = () => (
  <Nest elements={providers}>
    <CssBaseline />
    <div>hello world</div>
  </Nest>
);

const Nest: FC<{ elements: ReactElement[] }> = ({ elements, children }) =>
  elements.reduceRight(
    (out, element) => cloneElement(element, {}, out),
    <>{children}</>
  );
