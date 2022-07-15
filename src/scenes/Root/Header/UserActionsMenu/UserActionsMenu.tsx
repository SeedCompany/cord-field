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
import { useUpload, useUploadManager } from '../../../../components/Upload';

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
  const { isManagerOpen, setIsManagerOpen } = useUploadManager();
  const { removeCompletedUploads } = useUpload();

  const UmIcon = isManagerOpen ? HideIcon : ShowIcon;

  const handleUploadManagerToggle = () => {
    if (isManagerOpen) {
      removeCompletedUploads();
    }
    setIsManagerOpen(!isManagerOpen);
  };

  return (
    <Menu
      id="profile-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: spacing(-2), horizontal: 'right' }}
      classes={{ paper: classes.menu }}
      {...props}
    >
      <MenuItem onClick={handleUploadManagerToggle}>
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
