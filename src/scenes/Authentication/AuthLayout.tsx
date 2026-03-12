import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { Picture } from '../../components/Picture';
import backgroundImg from './background.png';

const Root = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
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
    <Content>{children ?? <Outlet />}</Content>
  </Root>
);
