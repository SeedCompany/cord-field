import {
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  MenuProps,
  useTheme,
} from '@material-ui/core';
import {
  BorderColor as BorderColorIcon,
  CloudDownload as CloudDownloadIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  MoreVert as MoreIcon,
} from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { Directory, File } from '../../api';

const useStyles = makeStyles(({ spacing }) => ({
  listItemIcon: {
    marginRight: spacing(2),
    minWidth: 'unset',
  },
}));

const menuItems = [
  {
    text: 'Rename',
    icon: BorderColorIcon,
  },
  {
    text: 'Download',
    icon: CloudDownloadIcon,
  },
  {
    text: 'History',
    icon: HistoryIcon,
  },
  {
    text: 'Delete',
    icon: DeleteIcon,
  },
];

interface FileActionsPopupProps {
  item: File | Directory;
}

export const FileActionsPopup: FC<FileActionsPopupProps> = (props) => {
  const { item } = props;
  const [anchor, setAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreIcon />
      </IconButton>
      <FileActionsMenu
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        category={item.category === 'Directory' ? 'Directory' : 'File'}
      />
    </>
  );
};

type FileActionsMenuProps = Partial<MenuProps> & {
  category: 'Directory' | 'File';
};

export const FileActionsMenu: FC<FileActionsMenuProps> = (props) => {
  const classes = useStyles();
  const { spacing } = useTheme();

  return (
    <Menu
      id="file-actions-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: spacing(-2), horizontal: 'right' }}
      {...props}
    >
      {menuItems.map((item) => {
        const { text, icon: Icon } = item;
        return (
          <MenuItem key={text}>
            <ListItemIcon className={classes.listItemIcon}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={text} />
          </MenuItem>
        );
      })}
    </Menu>
  );
};
