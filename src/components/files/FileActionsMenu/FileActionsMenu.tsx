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
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  // History as HistoryIcon,
  MoreVert as MoreIcon,
  BorderColor as RenameIcon,
} from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { Directory, File } from '../../../api';

const useStyles = makeStyles(({ spacing }) => ({
  listItemIcon: {
    marginRight: spacing(2),
    minWidth: 'unset',
  },
  listItemText: {
    textTransform: 'capitalize',
  },
}));

export type FileActionItem = File | Directory;

export enum FileAction {
  Rename = 'rename',
  Download = 'download',
  History = 'history',
  Delete = 'delete',
}

export type FileActionHandler = (
  item: FileActionItem,
  action: FileAction
) => void;

interface FileActionsPopupProps {
  item: FileActionItem;
  onFileAction: FileActionHandler;
}

const menuItems = [
  {
    text: FileAction['Rename'],
    icon: RenameIcon,
    directory: true,
  },
  {
    text: FileAction['Download'],
    icon: DownloadIcon,
  },
  // {
  //   text: FileAction['History'],
  //   icon: HistoryIcon,
  // },
  {
    text: FileAction['Delete'],
    icon: DeleteIcon,
    directory: true,
  },
];

export const FileActionsPopup: FC<FileActionsPopupProps> = (props) => {
  const { item, onFileAction } = props;
  const [anchor, setAnchor] = useState<MenuProps['anchorEl']>();

  const openAddMenu = (e: any) => setAnchor(e.currentTarget);
  const closeAddMenu = () => setAnchor(null);

  return (
    <>
      <IconButton onClick={openAddMenu}>
        <MoreIcon />
      </IconButton>
      <FileActionsMenu
        anchorEl={anchor}
        onAction={onFileAction}
        onClose={closeAddMenu}
        item={item}
      />
    </>
  );
};

type FileActionsMenuProps = Partial<MenuProps> & {
  item: FileActionItem;
  onAction: FileActionHandler;
};

export const FileActionsMenu: FC<FileActionsMenuProps> = (props) => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { item, onAction, ...rest } = props;

  const close = () => props.onClose?.({}, 'backdropClick');

  const handleActionClick = (action: FileAction) => {
    close();
    onAction(item, action);
  };

  return (
    <Menu
      id="file-actions-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: spacing(-2), horizontal: 'right' }}
      {...rest}
    >
      {menuItems.map((menuItem) => {
        const { text, icon: Icon, directory } = menuItem;
        return item.category === 'Directory' && !directory ? null : (
          <MenuItem key={text} onClick={handleActionClick.bind(null, text)}>
            <ListItemIcon className={classes.listItemIcon}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary={text} />
          </MenuItem>
        );
      })}
    </Menu>
  );
};
