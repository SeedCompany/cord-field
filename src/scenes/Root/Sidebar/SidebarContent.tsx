import { Dashboard, FolderOpen, Language, Person } from '@mui/icons-material';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
} from '@mui/material';
import { ComponentType } from 'react';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ListItemLink, ListItemLinkProps } from '~/components/Routing';
import { CreateButtonMenu } from '../Creates';
import { SidebarHeader } from './SidebarHeader';

export interface SidebarContentProps {
  /**
   * Called when the user clicks any navigation item — used to dismiss the
   * mobile drawer after a route change. Not called when interacting with
   * the Create button or the sidebar subheader.
   */
  onNavigate?: () => void;
}

export const SidebarContent = ({ onNavigate }: SidebarContentProps) => (
  <>
    <SidebarHeader />
    <Box sx={{ px: 2 }}>
      <CreateButtonMenu
        sx={(theme) => ({
          mx: 2,
          mt: 4,
          mb: 1,
          width: `calc(100% - ${theme.spacing(2 * 2)})`,
        })}
      />
      <List component="nav" aria-label="sidebar">
        <NavItem
          to="/dashboard"
          label="My Dashboard"
          icon={Dashboard}
          onClick={onNavigate}
        />
        <NavItem
          to="/projects"
          label="Projects"
          icon={FolderOpen}
          active={[
            { path: '/projects', end: false },
            { path: '/engagements', end: false },
          ]}
          onClick={onNavigate}
        />
        <NavItem
          to="/languages"
          label="Languages"
          icon={Language}
          onClick={onNavigate}
        />
        <NavItem
          to="/users"
          label="People"
          icon={Person}
          onClick={onNavigate}
        />
        <NavItem
          to="/partners"
          label="Partners"
          icon={PeopleJoinedIcon}
          onClick={onNavigate}
        />
      </List>
    </Box>
  </>
);

const NavItem = ({
  icon: Icon,
  label,
  ...props
}: ListItemLinkProps & {
  icon: ComponentType<SvgIconProps>;
  label: string;
}) => (
  <ListItemLink {...props}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText>{label}</ListItemText>
  </ListItemLink>
);
