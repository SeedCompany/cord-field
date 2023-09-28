import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { ApolloProvider, GqlSensitiveOperations } from './api';
import { LuxonCalenderDateUtils } from './common/LuxonCalenderDateUtils';
import { ConfettiProvider } from './components/Confetti';
import { Nest } from './components/Nest';
import { SnackbarProvider } from './components/Snackbar';
import { UploadProvider as FileUploadProvider } from './components/Upload';
import { Root } from './scenes/Root';
import { createTheme } from './theme';

const logRocketAppId = process.env.RAZZLE_LOG_ROCKET_APP_ID;
if (logRocketAppId) {
  LogRocket.init(logRocketAppId, {
    shouldParseXHRBlob: true, // Parse API response bodies
    network: {
      requestSanitizer(request) {
        // Relies on operation name suffix which do in Apollo HttpLink config
        if (
          [...GqlSensitiveOperations].some((op) =>
            request.url.endsWith(`/${op}`)
          )
        ) {
          request.body = undefined;
        }
        return request;
      },
    },
  });
  if (typeof window !== 'undefined') {
    setupLogRocketReact(LogRocket);
  }
}

/**
 * Register all app providers here in a flat list.
 * These are used client-side, server-side, and in storybook.
 * This prevents git diff churning
 * Order still matters (the first is the outer most component)
 */
export const appProviders = [
  <ThemeProvider key="theme" theme={createTheme()} />,
  <LocalizationProvider key="i10n" dateAdapter={LuxonCalenderDateUtils} />,
  <SnackbarProvider key="snackbar" />, // needed by apollo
  <ApolloProvider key="apollo" />,
  <FileUploadProvider key="files" />,
  <ConfettiProvider key="confetti" />,
];

export const App = () => (
  <Nest elements={appProviders}>
    <Root />
  </Nest>
);
