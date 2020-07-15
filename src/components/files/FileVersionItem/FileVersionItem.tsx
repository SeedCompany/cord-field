import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDateFormatter } from '../../Formatters';
import { useFileNodeIcon } from '../useFileNodeIcon';
import { FileVersionItemFragment } from './FileVersionItem.generated';

const useStyles = makeStyles(({ spacing, typography }) => ({
  iconContainer: {
    marginRight: spacing(2),
    minWidth: spacing(4),
  },
  icon: {
    fontSize: typography.h2.fontSize,
  },
  text: {
    marginRight: spacing(2),
  },
}));

interface FileVersionItemProps {
  version: FileVersionItemFragment;
}

export const FileVersionItem: FC<FileVersionItemProps> = (props) => {
  const classes = useStyles();
  const formatDate = useDateFormatter();
  const fileIcon = useFileNodeIcon();
  const { version } = props;
  const { category, createdAt, createdBy, name } = version;
  const Icon = fileIcon(category);
  const createdByUser = `${createdBy.displayFirstName.value} ${createdBy.displayLastName.value}`;
  return (
    <ListItem>
      <ListItemIcon className={classes.iconContainer}>
        <Icon className={classes.icon} />
      </ListItemIcon>
      <ListItemText
        className={classes.text}
        primary={name}
        secondary={`Modified on ${formatDate(createdAt)} by ${createdByUser}`}
      />
      <ListItemSecondaryAction>
        <DownloadIcon />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
