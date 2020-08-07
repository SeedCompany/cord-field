import { Box, IconButton } from '@material-ui/core';
import { CreateNewFolder, Publish } from '@material-ui/icons';
import React from 'react';
import { useDialog } from '../../../components/Dialog';
import { CreateProjectDirectory } from './CreateProjectDirectory';
import { UploadProjectFiles } from './UploadProjectFiles';

export const FileCreateActions = () => {
  const [createDirectoryState, createDirectory] = useDialog();
  const [uploadFileState, uploadFile] = useDialog();
  return (
    <>
      <Box>
        <IconButton onClick={uploadFile} size="small">
          <Publish />
        </IconButton>
        <IconButton onClick={createDirectory} size="small">
          <CreateNewFolder />
        </IconButton>
      </Box>
      <CreateProjectDirectory {...createDirectoryState} />
      <UploadProjectFiles {...uploadFileState} />
    </>
  );
};
