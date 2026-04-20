import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';

interface PostListItemMenuProps extends Partial<MenuProps> {
  onEdit: () => void;
  onDelete: () => void;
}

export const PostListItemMenu = (props: PostListItemMenuProps) => {
  const { onEdit, onDelete, ...rest } = props;

  return (
    <Menu
      id="post-options-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      {...rest}
    >
      <MenuItem onClick={onEdit}>
        <ListItemIcon sx={{ mr: 2, minWidth: 'unset' }}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit Post" />
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <ListItemIcon sx={{ mr: 2, minWidth: 'unset' }}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete Post" />
      </MenuItem>
    </Menu>
  );
};
