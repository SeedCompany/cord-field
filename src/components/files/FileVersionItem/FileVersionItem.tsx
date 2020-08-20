import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, { FC } from 'react';
import { useDateTimeFormatter } from '../../Formatters';
import {
  FileActionsPopup as ActionsMenu,
  useFileActions,
} from '../FileActions';
import { fileIcon } from '../fileTypes';
import { FileVersionItem_FileVersion_Fragment } from './FileVersionItem.generated';

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
  version: FileVersionItem_FileVersion_Fragment;
}

export const FileVersionItem: FC<FileVersionItemProps> = (props) => {
  const classes = useStyles();
  const formatDate = useDateTimeFormatter();
  const { openFilePreview } = useFileActions();
  const { version } = props;

  const { createdAt, createdBy, name } = version;
  const Icon = fileIcon(version.mimeType);
  const createdByUser = `${createdBy.displayFirstName.value} ${createdBy.displayLastName.value}`;

  return (
    <ListItem>
      <ListItemIcon className={classes.iconContainer}>
        <Icon className={classes.icon} />
      </ListItemIcon>
      <ListItemText
        onClick={() => openFilePreview(version)}
        className={classes.text}
        primary={name}
        secondary={`Created on ${formatDate(createdAt)} by ${createdByUser}`}
      />
      <ListItemSecondaryAction>
        <ActionsMenu item={version} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
