import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDateTimeFormatter } from '../../Formatters';
import { useDownloadFile, useFileNodeIcon } from '../hooks';
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
    marginRight: spacing(3),
  },
}));

interface FileVersionItemProps {
  version: FileVersionItemFragment;
}

export const FileVersionItem: FC<FileVersionItemProps> = (props) => {
  const classes = useStyles();
  const formatDate = useDateTimeFormatter();
  const downloadFile = useDownloadFile();
  const fileIcon = useFileNodeIcon();
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
    <ListItem>
      <ListItemIcon className={classes.iconContainer}>
        <Icon className={classes.icon} />
      </ListItemIcon>
      <ListItemText
        className={classes.text}
        primary={name}
        secondary={`Created on ${formatDate(createdAt)} by ${createdByUser}`}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => downloadFile(version)}>
          <DownloadIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
