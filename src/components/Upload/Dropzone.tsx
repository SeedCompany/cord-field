import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileInput, useUpload } from '../../components/Upload';

const useStyles = makeStyles(({ palette, spacing }) => {
  const dropzoneHoverStyle = {
    backgroundColor: palette.grey[200],
    borderColor: palette.primary.main,
  };
  return {
    container: {
      padding: spacing(3),
    },
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

export const Dropzone = () => {
  const classes = useStyles();
  const { addFilesToUploadQueue } = useUpload();

  const onDrop = useCallback(
    (acceptedFiles) => {
      const fileInputs = acceptedFiles.reduce(
        (inputs: FileInput[], file: File) => {
          const input = {
            file,
            fileName: file.name,
            callback: () => Promise.resolve(console.log('DONE')),
          };
          return inputs.concat(input);
        },
        []
      );
      addFilesToUploadQueue(fileInputs);
    },
    [addFilesToUploadQueue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Paper className={classes.container}>
      <div
        className={clsx(classes.dropzone, {
          [classes.active]: isDragActive,
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Typography variant="h4" className={classes.instructions}>
          Click or drag files in to upload
        </Typography>
      </div>
    </Paper>
  );
};
