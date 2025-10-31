import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { FormattedDateTime } from '../../Formatters';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  useFileActions,
} from '../FileActions';
import { getFileComponents } from '../fileTypes';
import { FileVersionItem_FileVersion_Fragment } from './FileVersionItem.graphql';

interface FileVersionItemProps {
  version: FileVersionItem_FileVersion_Fragment;
  actions: FileAction[];
}

export const FileVersionItem = (props: FileVersionItemProps) => {
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
  const { Icon } = getFileComponents(version.mimeType);
  const createdByUser = createdBy.fullName;

  return (
    <ListItem>
      <ListItemIcon
        sx={(theme) => ({ marginRight: 2, minWidth: theme.spacing(4) })}
      >
        <Icon sx={{ fontSize: 'h2.fontSize' }} />
      </ListItemIcon>
      <ListItemText
        onClick={() => openFilePreview(version)}
        sx={{ cursor: 'pointer', marginRight: 3 }}
        primary={name}
        secondary={
          <>
            Created <FormattedDateTime date={createdAt} />
            {createdByUser ? ` by ${createdByUser}` : ''}
          </>
        }
      />
      <ListItemSecondaryAction>
        <ActionsMenu item={version} actions={menuActions} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
