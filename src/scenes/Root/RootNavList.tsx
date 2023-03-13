import { FolderOpen, Language, Person } from '@mui/icons-material';
import {
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
} from '@mui/material';
import { ComponentType, ReactNode } from 'react';
import { Sx } from '~/common';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ListItemLink, ListItemLinkProps } from '~/components/Routing';
import { CreateButtonMenu } from './Creates';

const bgColorContrast = { bgcolor: 'primary.contrastText' } satisfies Sx;
const colorContrast = { color: 'primary.contrastText' } satisfies Sx;

type NavItemProps = {
  icon: ComponentType<SvgIconProps>;
  label: string;
} & ListItemLinkProps;

const navItems = [
  { label: 'Projects', to: '/projects', icon: FolderOpen },
  { label: 'Languages', to: '/languages', icon: Language },
  { label: 'People', to: '/users', icon: Person },
  { label: 'Partners', to: '/partners', icon: PeopleJoinedIcon },
];

const NavItem = ({ icon: Icon, label, ...props }: NavItemProps) => (
  <ListItemLink {...props}>
    <ListItemIcon>
      <Icon sx={{ ...colorContrast }} />
    </ListItemIcon>
    <ListItemText sx={{ '& .MuiTypography-root': { ...colorContrast } }}>
      {label}
    </ListItemText>
  </ListItemLink>
);

const MobileDivider = () => (
  <Divider
    sx={{
      ...bgColorContrast,
      ml: -1,
      // 8px is the padding of the List
      width: 'calc(100% + 8px * 2)',
      display: { sm: 'none' },
    }}
  />
);

export const RootNavList = ({ subheader }: { subheader: ReactNode }) => (
  <>
    <List
      component="nav"
      aria-label="Mobile Menu"
      sx={{ px: 1, pb: 0, mt: { sm: 4 } }}
      subheader={subheader}
    >
      <MobileDivider />
      {navItems.map(({ label, to, icon }) => (
        <NavItem key={label} to={to} icon={icon} label={label} />
      ))}
      <MobileDivider />
    </List>
    <CreateButtonMenu
      sx={(theme) => ({
        m: { xs: 1, sm: theme.spacing(1, 2, 1) },
        width: { sm: `calc(100% - ${theme.spacing(2 * 2)})` },
      })}
    />
  </>
);

export const getActiveItemLabel = () => {
  const path = typeof window === 'undefined' ? '' : window.location.pathname;
  if (path.includes('/users/')) {
    return 'Profile';
  }

  const activeItem = navItems.find(({ to }) => path.startsWith(to));
  return activeItem?.label ?? 'Projects';
};
