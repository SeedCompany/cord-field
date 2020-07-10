import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  InsertDriveFile as FileIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { FC, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFieldName } from './FieldGroup';
import { FieldConfig, useField } from './useField';

const useStyles = makeStyles(({ palette, spacing }) => {
  const dropzoneHoverStyle = {
    backgroundColor: palette.grey[200],
    borderColor: palette.primary.main,
  };
  return {
    dropzone: {
      backgroundColor: palette.grey[300],
      border: `2px dashed ${palette.divider}`,
      cursor: 'pointer',
      padding: spacing(3),
      '&:hover': dropzoneHoverStyle,
    },
    active: dropzoneHoverStyle,
    instructions: {
      color: palette.text.secondary,
      textAlign: 'center',
    },
  };
});

export type DropzoneFieldProps<FieldValue = File[]> = FieldConfig<
  FieldValue
> & {
  name: string;
};

export const DropzoneField: FC<DropzoneFieldProps> = ({ name: nameProp }) => {
  const classes = useStyles();

  // Memoize defaultValue to prevent re-renders when not changing.
  const defaultValue = useMemo(() => [], []);
  const name = useFieldName(nameProp);
  const {
    input: { onChange, value: currentFiles },
  } = useField<File[], HTMLInputElement>(name, { defaultValue });

  const onDrop = useCallback(
    (acceptedFiles) => {
      onChange(currentFiles.concat(acceptedFiles));
    },
    [onChange, currentFiles]
  );

  const handleRemoveFileClick = useCallback(
    (index: number) => {
      const updatedFiles = currentFiles
        .slice(0, index)
        .concat(currentFiles.slice(index + 1));
      onChange(updatedFiles);
    },
    [onChange, currentFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        className={clsx(classes.dropzone, {
          [classes.active]: isDragActive,
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} name={name} />
        <Typography variant="h4" className={classes.instructions}>
          Click or drag files in to upload
        </Typography>
      </div>
      {currentFiles.length > 0 && (
        <>
          <List dense>
            {currentFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText primary={file.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    size="small"
                    onClick={() => handleRemoveFileClick(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
};
