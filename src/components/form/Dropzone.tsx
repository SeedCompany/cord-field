import { Clear as ClearIcon } from '@mui/icons-material';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { makeStyles } from 'tss-react/mui';
import { Except } from 'type-fest';
import { extendSx, StyleProps } from '~/common';
import { getFileComponents } from '../files';
import { FieldConfig, useField } from './useField';

const useStyles = makeStyles()(({ palette, spacing, shape }) => {
  const dropzoneHoverStyle = {
    borderColor: palette.primary.main,
  };
  return {
    dropzone: {
      borderRadius: shape.borderRadius,
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
    files: {
      paddingBottom: 0,
    },
  };
});

export type DropzoneFieldProps = Except<FieldConfig<File, true>, 'multiple'> &
  StyleProps & {
    label?: ReactNode;
    multiple?: boolean;
    disableFileList?: boolean;
    accept?: Accept;
  };

export function DropzoneField({
  multiple = false,
  label = 'Click or drag files here',
  name: nameProp,
  className,
  sx,
  disableFileList,
  accept,
}: DropzoneFieldProps) {
  const { classes, cx } = useStyles();

  const {
    input: { name, onChange, value: currentFiles },
  } = useField<File, true, HTMLInputElement>({
    name: nameProp,
    multiple: true, // always list for FF
  });

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
    accept: accept,
  });

  return (
    <Box sx={[{ mb: 2 }, ...extendSx(sx)]} className={className}>
      <div
        className={cx(classes.dropzone, {
          [classes.active]: isDragActive,
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} name={name} />
        <Typography variant="h4" className={classes.instructions}>
          {label}
        </Typography>
      </div>
      {!disableFileList && currentFiles.length > 0 && (
        <List dense className={classes.files}>
          {currentFiles.map((file, index) => {
            const { name, type } = file;
            const { Icon } = getFileComponents(type);
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
      )}
    </Box>
  );
}
