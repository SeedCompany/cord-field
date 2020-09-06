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
  HandleFileActionClickParams,
  PermittedActions,
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
    '&:focus': {
      outline: 'none',
    },
  },
}));

interface FileActionsList {
  actions: PermittedActions;
}

interface NonVersionPopupProps extends FileActionsList {
  item: DirectoryActionItem | FileActionItem;
  onVersionUpload: (files: File[]) => void;
}

interface VersionPopupProps extends FileActionsList {
  item: VersionActionItem;
}

type FileActionsPopupProps = NonVersionPopupProps | VersionPopupProps;

const actionIcons = {
  [FileAction.Rename]: RenameIcon,
  [FileAction.Download]: DownloadIcon,
  [FileAction.History]: HistoryIcon,
  [FileAction.NewVersion]: AddIcon,
  [FileAction.Delete]: DeleteIcon,
};

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

const isFileVersion = (
  props: FileActionsPopupProps
): props is VersionPopupProps => props.item.__typename === 'FileVersion';

export const FileActionsMenu: FC<FileActionsMenuProps> = (props) => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { item, actions, ...rest } = props;

  const menuActions = Array.isArray(actions)
    ? [...new Set(actions)]
    : isFileVersion(props)
    ? [...new Set(actions.version)]
    : [...new Set(actions.file)];
  const versionMenuActions = Array.isArray(actions)
    ? menuActions
    : [...new Set(actions.version)];

  const { handleFileActionClick } = useFileActions();

  const menuProps = Object.entries(rest).reduce((menuProps, [key, value]) => {
    return key === 'onVersionUpload' || key === 'canEdit'
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
    const params = {
      item,
      action,
      ...(action === FileAction.History
        ? { versionActions: versionMenuActions }
        : null),
    };
    handleFileActionClick(params as HandleFileActionClickParams);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop:
      'onVersionUpload' in props
        ? props.onVersionUpload
        : () => {
            return;
          },
    multiple: false,
    noDrag: true,
  });

  const menuItemContents = (menuItem: FileAction) => {
    const Icon = actionIcons[menuItem];
    return (
      <>
        <ListItemIcon className={classes.listItemIcon}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText className={classes.listItemText} primary={menuItem} />
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
      {menuActions.map((action) => {
        return (
          <MenuItem
            key={action}
            onClick={
              action === FileAction.NewVersion
                ? (event) => event.stopPropagation()
                : (event) => handleActionClick(event, action)
            }
          >
            {action === FileAction.NewVersion ? (
              <span {...getRootProps()} className={classes.newVersionItem}>
                <input {...getInputProps()} name="file-version-uploader" />
                {menuItemContents(action)}
              </span>
            ) : (
              menuItemContents(action)
            )}
          </MenuItem>
        );
      })}
    </Menu>
  );
};
