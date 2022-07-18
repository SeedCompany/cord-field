import { CssBaseline } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { Picture } from '../../components/Picture';
import { createTheme } from '../../theme';
import backgroundImg from './background.png';

const Root = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  position: 'relative', // for background
});

const authTheme = createTheme({ dark: true });

export const AuthLayout = ({ children }: ChildrenProp) => (
  <ThemeProvider theme={authTheme}>
    <CssBaseline />
    <Root>
      <Picture lazy background source={backgroundImg} />
      {children ?? <Outlet />}
    </Root>
  </ThemeProvider>
);
