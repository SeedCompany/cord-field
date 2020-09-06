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
import {
  DirectoryActionItem,
  FileAction,
  FileActionItem,
  useFileActions,
  VersionActionItem,
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

interface NonVersionPopupProps {
  item: DirectoryActionItem | FileActionItem;
  onVersionUpload: (files: File[]) => void;
  canEdit?: boolean;
}

interface VersionPopupProps {
  item: VersionActionItem;
}

type FileActionsPopupProps = NonVersionPopupProps | VersionPopupProps;

const MENU_ITEMS = [
  {
    text: FileAction.Rename,
    icon: RenameIcon,
    version: true,
    directory: true,
    type: 'edit',
  },
  {
    text: FileAction.Download,
    icon: DownloadIcon,
    version: true,
    engagement: true,
    type: 'read',
  },
  {
    text: FileAction.History,
    icon: HistoryIcon,
    engagement: true,
    type: 'read',
  },
  {
    text: FileAction.NewVersion,
    icon: AddIcon,
    engagement: true,
    type: 'edit',
  },
  {
    text: FileAction.Delete,
    icon: DeleteIcon,
    version: true,
    directory: true,
    type: 'edit',
  },
];

export const FileActionsPopup: FC<FileActionsPopupProps> = (props) => {
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
      <FileActionsMenu anchorEl={anchor} onClose={closeAddMenu} {...props} />
    </>
  );
};

type FileActionsMenuProps = Partial<MenuProps> & FileActionsPopupProps;

export const FileActionsMenu: FC<FileActionsMenuProps> = (props) => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { item, ...rest } = props;

  const { context, handleFileActionClick } = useFileActions();

  const canEdit = 'canEdit' in props ? props.canEdit : true;

  const menuProps = Object.entries(rest).reduce((menuProps, [key, value]) => {
    return key === 'onVersionUpload'
      ? menuProps
      : {
          ...menuProps,
          [key]: value,
        };
  }, {});

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
    onDrop:
      'onVersionUpload' in props
        ? props.onVersionUpload
        : () => {
            return;
          },
    disabled: !canEdit,
    multiple: false,
    noDrag: true,
  });

  const menuItems = MENU_ITEMS.filter((menuItem) => {
    const { directory, engagement, version, type } = menuItem;
    return type === 'edit' && !canEdit
      ? false
      : context === 'engagement'
      ? item.type === 'FileVersion'
        ? engagement && version
        : engagement
      : item.type === 'Directory'
      ? directory
      : item.type === 'FileVersion'
      ? version
      : true;
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
      open={Boolean(props.anchorEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: spacing(-2), horizontal: 'right' }}
      {...menuProps}
    >
      {menuItems.map((menuItem) => {
        const { text } = menuItem;
        return (
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
