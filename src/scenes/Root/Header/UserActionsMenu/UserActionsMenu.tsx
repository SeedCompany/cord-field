import {
  VisibilityOff as HideIcon,
  Visibility as ShowIcon,
} from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { useUpload } from '../../../../components/Upload';

const useStyles = makeStyles()(({ spacing }) => ({
  menu: {
    minWidth: 200,
  },
  listItemIcon: {
    marginRight: spacing(2),
    minWidth: 'unset',
  },
  listItemText: {
    textTransform: 'capitalize',
  },
}));

export const UserActionsMenu = (props: Partial<MenuProps>) => {
  const { classes } = useStyles();
  const { spacing } = useTheme();
  const { isManagerOpen, toggleManagerOpen } = useUpload();

  const UmIcon = isManagerOpen ? HideIcon : ShowIcon;

  return (
    <Menu
      id="user-actions-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: parseInt(spacing(-2)), horizontal: 'right' }}
      classes={{ paper: classes.menu }}
      {...props}
    >
      <MenuItem
        onClick={(event) => {
          toggleManagerOpen();
          // @ts-expect-error yeah we are adding a reason
          props.onClose?.(event, 'actionClicked');
        }}
      >
        <ListItemIcon className={classes.listItemIcon}>
          <UmIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          className={classes.listItemText}
          primary="upload manager"
        />
      </MenuItem>
    </Menu>
  );
};
