import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUpload } from '../../components/Upload';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    padding: spacing(3),
  },
  dropzone: {
    backgroundColor: palette.grey[300],
    border: `2px dashed ${palette.divider}`,
    padding: spacing(3),
  },
  active: {
    backgroundColor: palette.grey[200],
    borderColor: palette.primary.main,
  },
  instructions: {
    color: palette.text.secondary,
    textAlign: 'center',
  },
}));

export const Dropzone = () => {
  const classes = useStyles();
  const { addFileToUploadQueue } = useUpload();

  const onDrop = useCallback(
    (acceptedFiles) => {
      for (const file of acceptedFiles) {
        addFileToUploadQueue(file);
      }
    },
    [addFileToUploadQueue]
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
