import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { Picture } from '../../components/Picture';
import backgroundImg from './background.png';

const Root = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  position: 'relative',
});

// Darkens background image in dark mode; transparent in light mode
const Scrim = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.65)' : 'transparent',
  zIndex: 1,
}));

const Content = styled('div')({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const AuthLayout = ({ children }: ChildrenProp) => (
  <Root>
    <Picture background source={backgroundImg} />
    <Scrim />
    <Content>{children ?? <Outlet />}</Content>
  </Root>
);
