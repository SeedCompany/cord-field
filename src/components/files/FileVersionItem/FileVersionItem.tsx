import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { useDateTimeFormatter } from '../../Formatters';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  useFileActions,
} from '../FileActions';
import { fileIcon } from '../fileTypes';
import { FileVersionItem_FileVersion_Fragment } from './FileVersionItem.graphql';

interface FileVersionItemProps {
  version: FileVersionItem_FileVersion_Fragment;
  actions: FileAction[];
}

export const FileVersionItem = (props: FileVersionItemProps) => {
  const formatDate = useDateTimeFormatter();
  const { openFilePreview } = useFileActions();
  const { version, actions } = props;

  /**
   * Consumers of the `FileActionsContext` are going to pass in a list
   * of actions that are permitted to the user for this `fileNode`.
   * Regardless of what's passed in, we do not at this time ever want to
   * allow for new versions of Versions or viewing the history of a
   * Version. Updating a report received date is also not allowed here
   * since that only applies at the report/file node level.
   */
  const menuActions = [
    ...new Set(
      actions.filter(
        (action) =>
          action !== FileAction.History &&
          action !== FileAction.NewVersion &&
          action !== FileAction.UpdateReceivedDate &&
          action !== FileAction.Skip
      )
    ),
  ];

  const { createdAt, createdBy, name } = version;
  const Icon = fileIcon(version.mimeType);
  const createdByUser = createdBy.fullName;

  return (
    <ListItem>
      <ListItemIcon
        sx={{
          mr: 2,
          minWidth: 4,
        }}
      >
        <Icon
          sx={{
            fontSize: 'h2.fontSize',
          }}
        />
      </ListItemIcon>
      <ListItemText
        onClick={() => openFilePreview(version)}
        sx={{
          cursor: 'pointer',
          mr: 3,
        }}
        primary={name}
        secondary={`Created on ${formatDate(createdAt)}${
          createdByUser ? ` by ${createdByUser}` : ''
        }`}
      />
      <ListItemSecondaryAction>
        <ActionsMenu item={version} actions={menuActions} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
