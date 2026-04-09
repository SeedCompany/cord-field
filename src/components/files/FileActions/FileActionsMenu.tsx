import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  Edit as EditSkipReason,
  History as HistoryIcon,
  MoreVert as MoreIcon,
  BorderColor as RenameIcon,
  SkipNextRounded as Skip,
  Event as UpdateDate,
} from '@mui/icons-material';
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { startCase } from 'lodash';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton, IconButtonProps } from '../../IconButton';
import { MenuItemLink } from '../../Routing';
import { FileAction } from './FileAction.enum';
import {
  DirectoryActionItem,
  FileActionItem,
  HandleFileActionClickParams,
  PermittedActions,
  useFileActions,
  VersionActionItem,
} from './FileActionsContext';

interface FileActionsList {
  actions: PermittedActions;
  IconButtonProps?: IconButtonProps;
}

interface NonVersionPopupProps extends FileActionsList {
  item: DirectoryActionItem | FileActionItem;
  onVersionUpload: (files: File[]) => void;
  onUpdateReceivedDate?: () => void;
  onSkip?: () => void;
  onEditSkipReason?: () => void;
}

interface VersionPopupProps extends FileActionsList {
  item: VersionActionItem;
  onVersionAccepted?: (files: File[]) => void;
}

type FileActionsPopupProps = NonVersionPopupProps | VersionPopupProps;

const actionIcons = {
  [FileAction.Rename]: RenameIcon,
  [FileAction.Download]: DownloadIcon,
  [FileAction.History]: HistoryIcon,
  [FileAction.NewVersion]: AddIcon,
  [FileAction.Delete]: DeleteIcon,
  [FileAction.UpdateReceivedDate]: UpdateDate,
  [FileAction.Skip]: Skip,
  [FileAction.EditSkipReason]: EditSkipReason,
};

export const FileActionsPopup = ({
  IconButtonProps,
  ...props
}: FileActionsPopupProps) => {
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
      <IconButton {...IconButtonProps} onClick={openAddMenu}>
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

export const FileActionsMenu = (props: FileActionsMenuProps) => {
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
    return key === 'onVersionUpload' ||
      key === 'onVersionAccepted' ||
      key === 'onUpdateReceivedDate' ||
      key === 'onSkip' ||
      key === 'onEditSkipReason'
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
    if (
      action === FileAction.UpdateReceivedDate &&
      !isFileVersion(props) &&
      props.onUpdateReceivedDate
    ) {
      props.onUpdateReceivedDate();
      return;
    }
    if (action === FileAction.Skip && !isFileVersion(props) && props.onSkip) {
      props.onSkip();
      return;
    }
    if (
      action === FileAction.EditSkipReason &&
      !isFileVersion(props) &&
      props.onEditSkipReason
    ) {
      props.onEditSkipReason();
      return;
    }
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
    onDropAccepted:
      'onVersionAccepted' in props
        ? props.onVersionAccepted
        : () => {
            return;
          },
  });

  const menuItemContents = (menuItem: FileAction) => {
    const Icon = actionIcons[menuItem];
    return (
      <>
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={startCase(menuItem)} />
      </>
    );
  };

  return (
    <Menu
      id="file-actions-menu"
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: parseInt(spacing(-2)), horizontal: 'right' }}
      {...menuProps}
    >
      {menuActions.map((action) => {
        return action === FileAction.Download &&
          item.__typename !== 'Directory' ? (
          <MenuItemLink
            key={action}
            // @ts-expect-error - The typename check above assures this won't be a directory, but the directory Type is still applying here despite it never truly being an option
            to={item.url}
            external={true}
            onClick={(event) => handleActionClick(event, action)}
          >
            {menuItemContents(action)}
          </MenuItemLink>
        ) : (
          <MenuItem
            key={action}
            onClick={
              action === FileAction.NewVersion
                ? (event) => event.stopPropagation()
                : (event) => handleActionClick(event, action)
            }
          >
            {action === FileAction.NewVersion ? (
              <Box
                component="span"
                {...getRootProps()}
                sx={{
                  display: 'flex',
                  mx: -2,
                  px: 2,
                }}
              >
                <input {...getInputProps()} name="file-version-uploader" />
                {menuItemContents(action)}
              </Box>
            ) : (
              menuItemContents(action)
            )}
          </MenuItem>
        );
      })}
      {menuActions.length === 0 && (
        <MenuItem disabled>No actions available</MenuItem>
      )}
    </Menu>
  );
};
