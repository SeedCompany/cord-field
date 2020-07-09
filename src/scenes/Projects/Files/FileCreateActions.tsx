import { Box, IconButton } from '@material-ui/core';
import { CreateNewFolder, Publish } from '@material-ui/icons';
import React from 'react';
import { useDialog } from '../../../components/Dialog';
import { CreateProjectDirectory } from './CreateProjectDirectory';

export const FileCreateActions = () => {
  const [createDirectoryState, createDirectory] = useDialog();
  // const [uploadFileState, uploadFile] = useDialog();
  return (
    <>
      <Box>
        <IconButton
          color="inherit"
          onClick={() => console.log('Upload file')}
          size="small"
        >
          <Publish />
        </IconButton>
        <IconButton color="inherit" onClick={createDirectory} size="small">
          <CreateNewFolder />
        </IconButton>
      </Box>
      <CreateProjectDirectory {...createDirectoryState} />
    </>
  );
};
