import {
  Avatar,
  Card,
  CardActionArea,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  NotInterested as NotPermittedIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { FC } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { DropzoneOverlay, DropzoneOverlayClasses } from '../Upload';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: spacing(3, 4),
  },
  avatar: {
    backgroundColor: '#f3f4f6',
    width: 58,
    height: 58,
  },
  icon: {
    color: 'white',
  },
  text: {
    marginTop: spacing(1),
    textTransform: 'none',
  },
}));

interface AddItemCardBaseProps {
  canAdd: boolean;
  className?: string;
  itemType: string;
}

interface AddItemDropzoneCard extends AddItemCardBaseProps {
  actionType: 'dropzone';
  DropzoneProps?: {
    options?: DropzoneOptions;
    classes?: DropzoneOverlayClasses;
  };
  handleFileSelect: (files: File[]) => void;
}

interface AddItemModalCard extends AddItemCardBaseProps {
  actionType: 'dialog';
  onClick: () => void;
}

type AddItemCardProps = AddItemDropzoneCard | AddItemModalCard;

export const AddItemCard: FC<AddItemCardProps> = (props) => {
  const classes = useStyles();
  const { actionType, canAdd, className, itemType } = props;

  const isDropzone = (props: AddItemCardProps): props is AddItemDropzoneCard =>
    props.actionType === 'dropzone';

  const dropzoneOptions = isDropzone(props)
    ? {
        ...props.DropzoneProps?.options,
        disabled: !canAdd,
        onDrop: props.handleFileSelect,
      }
    : {};

  const { getRootProps, getInputProps, isDragActive } = useDropzone(
    dropzoneOptions
  );

  const Icon = canAdd ? AddIcon : NotPermittedIcon;

  const card = (
    <Card
      className={clsx(classes.root, className)}
      {...(actionType === 'dropzone' ? { ...getRootProps() } : null)}
    >
      {isDropzone(props) && (
        <>
          <input {...getInputProps()} name="defined_file_version_uploader" />
          <DropzoneOverlay
            classes={props.DropzoneProps?.classes}
            isDragActive={isDragActive}
            message={`Add ${itemType} file`}
          />
        </>
      )}
      <CardActionArea
        className={classes.actionArea}
        disabled={!canAdd}
        onClick={!isDropzone(props) ? props.onClick : undefined}
      >
        <Avatar classes={{ root: classes.avatar }}>
          <Icon className={classes.icon} fontSize="large" />
        </Avatar>
        <Typography variant="button" className={classes.text}>
          Add {itemType}
        </Typography>
      </CardActionArea>
    </Card>
  );

  return !canAdd ? (
    <Tooltip title={`You do not have permission to add this ${itemType}`}>
      {card}
    </Tooltip>
  ) : (
    card
  );
};
