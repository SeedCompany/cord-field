import { IconButton } from '@material-ui/core';
import { CreateNewFolder, Publish } from '@material-ui/icons';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useDialog } from '../../../components/Dialog';
import { CreateProjectDirectory } from './CreateProjectDirectory';
import { useUploadProjectFiles } from './useUploadProjectFiles';

export const FileCreateActions = () => {
  const [createDirectoryState, createDirectory] = useDialog();
  const handleFilesDrop = useUploadProjectFiles();

  const { getRootProps, getInputProps, open: openFileBrowser } = useDropzone({
    onDrop: handleFilesDrop,
    noClick: true,
  });

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <IconButton onClick={openFileBrowser}>
          <Publish />
        </IconButton>
        <IconButton onClick={createDirectory}>
          <CreateNewFolder />
        </IconButton>
      </div>
      <CreateProjectDirectory {...createDirectoryState} />
    </>
  );
};
