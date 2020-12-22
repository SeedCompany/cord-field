import LuxonUtils from '@date-io/luxon';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/pickers';
import * as React from 'react';
import { Nest } from './components/Nest';
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
  <ThemeProvider theme={theme} children={<></>} />,
  <CssBaseline />,
  <LocalizationProvider dateAdapter={LuxonUtils} children={<></>} />,
  <UploadManagerProvider />,
  <UploadProvider />,
];

export const App = () => (
  <Nest elements={appProviders}>
    <Root />
  </Nest>
);
