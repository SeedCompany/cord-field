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
  FilesActionItem,
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
  newVersionItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing(-2),
    marginRight: spacing(-2),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    width: `calc(100% + (${spacing(2)}px * 2))`,
  },
}));

interface FileActionsPopupProps {
  item: FilesActionItem;
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
  item: FilesActionItem;
};

export const FileActionsMenu: FC<FileActionsMenuProps> = (props) => {
  const { item, ...rest } = props;
  const classes = useStyles();
  const { spacing } = useTheme();
  const handleFilesSelection = useUploadProjectFiles(item.id, 'version');
  const { handleFileActionClick } = useFileActions();

  const close = () => props.onClose?.({}, 'backdropClick');

  const handleActionClick = (
    event: React.MouseEvent,
    action: Exclude<FileAction, FileAction.NewVersion>
  ) => {
    event.stopPropagation();
    close();
    handleFileActionClick(item, action);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: handleFilesSelection,
    noDrag: true,
  });

  const menuItemContents = (menuItem: typeof menuItems[0]) => {
    const { text, icon: Icon } = menuItem;
    return (
      <>
        <ListItemIcon className={classes.listItemIcon}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText className={classes.listItemText} primary={text} />
      </>
    );
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
        const { text, directory, version } = menuItem;
        return (item.type === 'Directory' && !directory) ||
          (item.type === 'FileVersion' && !version) ? null : (
          <MenuItem
            key={text}
            onClick={
              text === FileAction.NewVersion
                ? (event) => event.stopPropagation()
                : (event) => handleActionClick(event, text)
            }
          >
            {text === FileAction.NewVersion ? (
              <span {...getRootProps()} className={classes.newVersionItem}>
                <input {...getInputProps()} name="file-version-uploader" />
                {menuItemContents(menuItem)}
              </span>
            ) : (
              menuItemContents(menuItem)
            )}
          </MenuItem>
        );
      })}
    </Menu>
  );
};
