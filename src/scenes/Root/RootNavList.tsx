import { FolderOpen, Language, Person } from '@mui/icons-material';
import { List, ListItemIcon, ListItemText, SvgIconProps } from '@mui/material';
import { ComponentType, ReactNode } from 'react';
import { Sx } from '~/common';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ListItemLink, ListItemLinkProps } from '~/components/Routing';

const colorContrast = { color: 'primary.contrastText' } satisfies Sx;
const bgColorWhite = { bgcolor: 'white' } satisfies Sx;
const colorBlack = { color: 'black' } satisfies Sx;

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
  <ListItemLink
    {...props}
    sx={{
      p: 0,
      height: 44,
      borderRadius: '0',
      ...bgColorWhite,
      '&:hover .MuiListItemIcon-root': { bgcolor: '#1EA973' },
    }}
  >
    <ListItemIcon
      sx={{
        width: 60,
        height: 1,
        '&:hover': { bgcolor: '#29B76E' },
        bgcolor: 'primary.main',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'icons.backgroundInactive',
      }}
    >
      <Icon sx={{ ...colorContrast }} />
    </ListItemIcon>
    <ListItemText
      sx={{
        m: 0,
        pl: 2,
        height: 1,
        display: 'flex',
        alignItems: 'center',
        ...bgColorWhite,
        '&:hover': { bgcolor: 'rgba(9, 16, 22, 0.04)' },
        '& .MuiTypography-root': { ...colorBlack },
      }}
    >
      {label}
    </ListItemText>
  </ListItemLink>
);

// const MobileDivider = () => (
//   <Divider
//     sx={{
//       ...bgColorContrast,
//       ml: -1,
//       // 8px is the padding of the List
//       width: 'calc(100% + 8px * 2)',
//       display: { sm: 'none' },
//     }}
//   />
// );

export const RootNavList = ({ subheader }: { subheader?: ReactNode }) => (
  <List
    component="nav"
    aria-label="Mobile Menu"
    sx={{ p: 0, ...bgColorWhite, ...colorBlack }}
    subheader={subheader}
  >
    {/* <MobileDivider /> */}
    {navItems.map(({ label, to, icon }) => (
      <NavItem key={label} to={to} icon={icon} label={label} />
    ))}
    {/* <MobileDivider /> */}
    {/* <Box
      sx={{
        width: designCollapsedWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'red', color: 'black' },
      }}
    >
      <AddCircleOutline sx={{ }} />
      <CreateButtonMenu
        sx={{ position: 'fixed', left: 65, ...colorBlack }}
        // sx={(theme) => ({
        //   m: { xs: 1, sm: theme.spacing(1, 2, 1) },
        //   width: { sm: `calc(100% - ${theme.spacing(2 * 2)})` },
        // })}

      />
    </Box> */}
  </List>
);

// export const getActiveItemLabel = () => {
//   const path = typeof window === 'undefined' ? '' : window.location.pathname;
//   if (path.includes('/users/')) {
//     return 'Profile';
//   }

//   const activeItem = navItems.find(({ to }) => path.startsWith(to));
//   return activeItem?.label ?? 'Projects';
// };
