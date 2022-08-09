import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

interface PostListItemMenuProps extends Partial<MenuProps> {
  onEdit: () => void;
  onDelete: () => void;
}

const useStyles = makeStyles()(({ spacing }) => ({
  listItemIcon: {
    marginRight: spacing(2),
    minWidth: 'unset',
  },
}));

export const PostListItemMenu = (props: PostListItemMenuProps) => {
  const { onEdit, onDelete, ...rest } = props;
  const { classes } = useStyles();

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
        <ListItemIcon className={classes.listItemIcon}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit Post" />
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <ListItemIcon className={classes.listItemIcon}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete Post" />
      </MenuItem>
    </Menu>
  );
};
