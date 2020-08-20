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
import { Clear as ClearIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { FC, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileIcon } from '../files/fileTypes';
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
  multiple?: boolean;
  name: string;
};

export const DropzoneField: FC<DropzoneFieldProps> = ({
  multiple = true,
  name: nameProp,
}) => {
  const classes = useStyles();

  // Memoize defaultValue to prevent re-renders when not changing.
  const defaultValue = useMemo(() => [], []);
  const name = useFieldName(nameProp);
  const {
    input: { onChange, value: currentFiles },
  } = useField<File[], HTMLInputElement>(name, { defaultValue });

  const onDrop = (acceptedFiles: File[]) => {
    const updatedFiles =
      // If no files are accepted, we want to leave the existing ones in place
      acceptedFiles.length === 0
        ? currentFiles
        : // If we allow multiples, we want to add all new files
        // to the existing ones. If not, we will overwrite.
        // `react-dropzone` won't accept more than one file if
        // `multiple` is false.
        multiple
        ? currentFiles.concat(acceptedFiles)
        : acceptedFiles;
    onChange(updatedFiles);
  };

  const handleRemoveFileClick = (index: number) => {
    const updatedFiles = currentFiles
      .slice(0, index)
      .concat(currentFiles.slice(index + 1));
    onChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    onDrop,
  });

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
            {currentFiles.map((file, index) => {
              const { name, type } = file;
              const Icon = fileIcon(type);
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
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
              );
            })}
          </List>
        </>
      )}
    </>
  );
};
