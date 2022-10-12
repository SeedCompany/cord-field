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
import { useUpload } from '../../../../components/Upload';

export const UserActionsMenu = (props: Partial<MenuProps>) => {
  const { spacing } = useTheme();
  const { isManagerOpen, toggleManagerOpen } = useUpload();

  const UmIcon = isManagerOpen ? HideIcon : ShowIcon;

  return (
    <Menu
      id="profile-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: parseInt(spacing(-2)), horizontal: 'right' }}
      sx={{
        '& .MuiMenu-paper': {
          minWidth: 200,
        },
      }}
      {...props}
    >
      <MenuItem
        onClick={(event) => {
          toggleManagerOpen();
          // @ts-expect-error yeah we are adding a reason
          props.onClose?.(event, 'actionClicked');
        }}
      >
        <ListItemIcon
          sx={{
            marginRight: spacing(2),
            minWidth: 'unset',
          }}
        >
          <UmIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="upload manager"
          sx={{
            textTransform: 'capitalize',
          }}
        />
      </MenuItem>
    </Menu>
  );
};
