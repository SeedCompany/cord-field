import {
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  MenuProps,
  useTheme,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import React from 'react';

interface PostListItemMenuProps extends Partial<MenuProps> {
  onEdit: () => void;
  onDelete: () => void;
}

const useStyles = makeStyles(({ spacing }) => ({
  listItemIcon: {
    marginRight: spacing(2),
    minWidth: 'unset',
  },
}));

export const PostListItemMenu = (props: PostListItemMenuProps) => {
  const classes = useStyles();
  const { spacing } = useTheme();

  return (
    <Menu
      id="profile-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: spacing(-2), horizontal: 'right' }}
      {...props}
    >
      <MenuItem onClick={props.onEdit}>
        <ListItemIcon className={classes.listItemIcon}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit Post" />
      </MenuItem>
      <MenuItem onClick={props.onDelete}>
        <ListItemIcon className={classes.listItemIcon}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete Post" />
      </MenuItem>
    </Menu>
  );
};
