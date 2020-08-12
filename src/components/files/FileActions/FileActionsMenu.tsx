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
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  History as HistoryIcon,
  MoreVert as MoreIcon,
  BorderColor as RenameIcon,
} from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadProjectFiles } from '../../../scenes/Projects/Files';
import {
  FileAction,
  FileActionItem,
  useFileActions,
} from './FileActionsContext';

const useStyles = makeStyles(({ spacing }) => ({
  listItemIcon: {
    marginRight: spacing(2),
    minWidth: 'unset',
  },
  listItemText: {
    textTransform: 'capitalize',
  },
}));

interface FileActionsPopupProps {
  item: FileActionItem;
}

const menuItems = [
  {
    text: FileAction.Rename,
    icon: RenameIcon,
    version: true,
    directory: true,
  },
  {
    text: FileAction.Download,
    icon: DownloadIcon,
    version: true,
  },
  {
    text: FileAction.History,
    icon: HistoryIcon,
  },
  {
    text: FileAction.NewVersion,
    icon: AddIcon,
  },
  {
    text: FileAction.Delete,
    icon: DeleteIcon,
    version: true,
    directory: true,
  },
];

export const FileActionsPopup: FC<FileActionsPopupProps> = (props) => {
  const { item } = props;
  const [anchor, setAnchor] = useState<MenuProps['anchorEl']>();

  const openAddMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchor(e.currentTarget);
  };
  const closeAddMenu = (e: Partial<React.SyntheticEvent>) => {
    e.stopPropagation?.();
    setAnchor(null);
  };

  return (
    <>
      <IconButton onClick={openAddMenu}>
        <MoreIcon />
      </IconButton>
      <FileActionsMenu anchorEl={anchor} onClose={closeAddMenu} item={item} />
    </>
  );
};

type FileActionsMenuProps = Partial<MenuProps> & {
  item: FileActionItem;
};

export const FileActionsMenu: FC<FileActionsMenuProps> = (props) => {
  const { item, ...rest } = props;
  const classes = useStyles();
  const { spacing } = useTheme();
  const handleFilesSelection = useUploadProjectFiles(item.id);
  const { handleFileActionClick } = useFileActions();

  const close = () => props.onClose?.({}, 'backdropClick');

  const handleActionClick = (event: React.MouseEvent, action: FileAction) => {
    event.stopPropagation();
    close();
    handleFileActionClick(item, action);
  };

  const renderedMenuItem = (menuItem: typeof menuItems[0]) => {
    const { text, icon: Icon, directory, version } = menuItem;
    return (item.type === 'Directory' && !directory) ||
      (item.type === 'FileVersion' && !version) ? null : (
      <MenuItem
        key={text}
        onClick={
          text === FileAction.NewVersion
            ? undefined
            : (event) => handleActionClick(event, text)
        }
      >
        <ListItemIcon className={classes.listItemIcon}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText className={classes.listItemText} primary={text} />
      </MenuItem>
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFilesSelection,
    noDrag: true,
  });

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
        return menuItem.text === FileAction.NewVersion ? (
          <div {...getRootProps()} key={menuItem.text}>
            <input {...getInputProps()} name="file-version-uploader" />
            {renderedMenuItem(menuItem)}
          </div>
        ) : (
          renderedMenuItem(menuItem)
        );
      })}
    </Menu>
  );
};
