import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';
import { useDateTimeFormatter } from '../../Formatters';
import {
  FileActionsPopup as ActionsMenu,
  useFileActions,
} from '../FileActions';
import { useFileNodeIcon } from '../hooks';
import {
  FileVersionItem_FileVersion_Fragment,
  FileVersionItemFragment,
} from './FileVersionItem.generated';

const useStyles = makeStyles(({ spacing, typography }) => ({
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
  version: FileVersionItemFragment;
}

export const FileVersionItem: FC<FileVersionItemProps> = (props) => {
  const classes = useStyles();
  const formatDate = useDateTimeFormatter();
  const fileIcon = useFileNodeIcon();
  const { openFilePreview } = useFileActions();
  const { version } = props;

  const isFileVersion = (
    version: FileVersionItemFragment
  ): version is FileVersionItem_FileVersion_Fragment =>
    version.type === 'FileVersion';

  const { createdAt, createdBy, name } = version;
  const mimeType = isFileVersion(version) ? version.mimeType : '';
  const Icon = fileIcon(mimeType);
  const createdByUser = `${createdBy.displayFirstName.value} ${createdBy.displayLastName.value}`;

  return (
    <>
      <ListItem>
        <ListItemIcon className={classes.iconContainer}>
          <Icon className={classes.icon} />
        </ListItemIcon>
        <ListItemText
          onClick={() => openFilePreview(version as File)}
          className={classes.text}
          primary={name}
          secondary={`Created on ${formatDate(createdAt)} by ${createdByUser}`}
        />
        <ListItemSecondaryAction>
          <ActionsMenu item={version as File} />
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
};
