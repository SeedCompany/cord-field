import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { FormattedDateTime } from '../../Formatters';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  useFileActions,
} from '../FileActions';
import { fileIcon } from '../fileTypes';
import { FileVersionItem_FileVersion_Fragment } from './FileVersionItem.graphql';

const useStyles = makeStyles()(({ spacing, typography }) => ({
  iconContainer: {
    marginRight: spacing(2),
    minWidth: spacing(4),
  },
  icon: {
    fontSize: typography.h2.fontSize,
  },
  text: {
    cursor: 'pointer',
    marginRight: spacing(3),
  },
}));

interface FileVersionItemProps {
  version: FileVersionItem_FileVersion_Fragment;
  actions: FileAction[];
}

export const FileVersionItem = (props: FileVersionItemProps) => {
  const { classes } = useStyles();
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
      <ListItemIcon className={classes.iconContainer}>
        <Icon className={classes.icon} />
      </ListItemIcon>
      <ListItemText
        onClick={() => openFilePreview(version)}
        className={classes.text}
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
