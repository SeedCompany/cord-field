import {
  Build,
  Dashboard,
  FolderOpen,
  Person,
  Translate,
} from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Paper,
  SvgIconProps,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ComponentType } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useIsMobile } from '~/common';
import { PeopleJoinedIcon } from '../../../components/Icons';
import { ListItemLink, ListItemLinkProps } from '../../../components/Routing';
import { CreateButtonMenu } from '../Creates';
import { sidebarTheme } from './sidebar.theme';
import { SidebarHeader } from './SidebarHeader';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    width: 248,
    overflowY: 'auto',
    flexShrink: 0,
  },
  content: {
    padding: spacing(0, 2),
  },
  createNewItem: {
    margin: spacing(4, 2, 1),
    width: `calc(100% - ${spacing(2 * 2)})`,
  },
}));

export interface SidebarProps {
  /** Mobile only: whether the temporary drawer is open. */
  open?: boolean;
  /** Mobile only: called to close the temporary drawer. */
  onClose?: () => void;
}

export const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  const { classes } = useStyles();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      // ThemeProvider must wrap the whole Drawer so its Paper surface picks up
      // the dark sidebar background (not just the content inside it).
      <ThemeProvider theme={sidebarTheme}>
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ className: classes.root }}
        >
          <SidebarContent classes={classes} />
        </Drawer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sidebarTheme}>
      <Paper elevation={0} square className={classes.root}>
        <SidebarContent classes={classes} />
      </Paper>
    </ThemeProvider>
  );
};

const SidebarContent = ({
  classes,
}: {
  classes: ReturnType<typeof useStyles>['classes'];
}) => (
  <>
    <SidebarHeader />
    <div className={classes.content}>
      <CreateButtonMenu fullWidth className={classes.createNewItem} />
      <List component="nav" aria-label="sidebar">
        <NavItem to="/dashboard" label="My Dashboard" icon={Dashboard} />
        <NavItem
          to="/projects"
          label="Projects"
          icon={FolderOpen}
          active={[
            { path: '/projects', end: false },
            { path: '/engagements', end: false },
          ]}
        />
        <NavItem to="/languages" label="Languages" icon={Translate} />
        <NavItem to="/users" label="People" icon={Person} />
        <NavItem to="/partners" label="Partners" icon={PeopleJoinedIcon} />
        <NavItem to="/tools" label="Tools" icon={Build} />
      </List>
    </div>
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
