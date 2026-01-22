import { useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { LicenseInfo as MuiXLicense } from '@mui/x-license';
import { isNotFalsy } from '@seedcompany/common';
import { ReactNode, useMemo } from 'react';
import { ApolloProvider, GqlSensitiveOperations } from './api';
import { LuxonCalenderDateUtils } from './common/LuxonCalenderDateUtils';
import { CommentsProvider } from './components/Comments/CommentsContext';
import { ConfettiProvider } from './components/Confetti';
import { Nest } from './components/Nest';
import { SessionProvider } from './components/Session';
import { SnackbarProvider } from './components/Snackbar';
import { UploadProvider as FileUploadProvider } from './components/Upload';
import { Root } from './scenes/Root';
import { createTheme } from './theme';

const logRocketAppId = process.env.RAZZLE_LOG_ROCKET_APP_ID;
if (logRocketAppId) {
  void Promise.all([import('logrocket'), import('logrocket-react')]).then(
    ([LogRocket, setupLogRocketReact]) => {
      LogRocket.default.init(logRocketAppId, {
        shouldParseXHRBlob: true, // Parse API response bodies
        network: {
          requestSanitizer(request) {
            // Relies on operation name suffix which is configured in Apollo HttpLink config
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
        setupLogRocketReact.default(LogRocket);
      }
    }
  );
}

MuiXLicense.setLicenseKey(process.env.MUI_X_LICENSE_KEY!);

const ThemeProviderWithDarkMode = ({ children }: { children?: ReactNode }) => {
  // Detect system/browser dark mode preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });
  
  const theme = useMemo(
    () => createTheme({ dark: prefersDarkMode }),
    [prefersDarkMode]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * Register all app providers here in a flat list.
 * These are used client-side, server-side, and in storybook.
 * This prevents git diff churning
 * Order still matters (the first is the outer most component)
 */
export const appProviders = [
  <ThemeProviderWithDarkMode key="theme" />,
  <LocalizationProvider key="i10n" dateAdapter={LuxonCalenderDateUtils} />,
  <SnackbarProvider key="snackbar" />, // needed by apollo
  <ApolloProvider key="apollo" />,
  <SessionProvider key="session" />,
  <FileUploadProvider key="files" />,
  <ConfettiProvider key="confetti" />,
  <CommentsProvider key="comments" />,
].filter(isNotFalsy);

export const App = () => (
  <Nest elements={appProviders}>
    <Root />
  </Nest>
);
