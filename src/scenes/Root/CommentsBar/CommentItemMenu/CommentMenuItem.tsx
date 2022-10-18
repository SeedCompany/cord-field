import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';

interface CommentItemMenuProps extends Partial<MenuProps> {
  threadId?: string;
  commentId: string;
  onDelete: () => void;
  onEdit: () => void;
}

export const CommentItemMenu = ({
  commentId,
  threadId,
  anchorEl,
  open,
  onDelete,
  onEdit,
  ...rest
}: CommentItemMenuProps) => {
  const listItemSx = {
    marginRight: 2,
    minWidth: 'unset',
  };

  return (
    <Menu
      id={`${commentId}-options-menu`}
      keepMounted
      open={Boolean(open)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorEl={anchorEl}
      {...rest}
    >
      <MenuItem onClick={onEdit}>
        <ListItemIcon sx={listItemSx}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <ListItemIcon sx={listItemSx}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </MenuItem>
    </Menu>
  );
};
