import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';
import { CommentFragment } from './comment.graphql';

interface CommentItemMenuProps extends Partial<MenuProps> {
  threadId?: string;
  comment: CommentFragment;
  onDelete: () => void;
  onEdit: () => void;
}

export const CommentItemMenu = ({
  comment,
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

  if (!comment.canDelete && !comment.body.canEdit) {
    return null;
  }

  return (
    <Menu
      id={`${comment.id}-options-menu`}
      open={Boolean(open)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorEl={anchorEl}
      {...rest}
    >
      {comment.body.canEdit && (
        <MenuItem onClick={onEdit}>
          <ListItemIcon sx={listItemSx}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
      )}
      {comment.canDelete && (
        <MenuItem onClick={onDelete}>
          <ListItemIcon sx={listItemSx}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      )}
    </Menu>
  );
};