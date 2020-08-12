import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { UploadFile, UploadState } from './Reducer/uploadTypings';
import { UploadItem } from './UploadItem';

const useStyles = makeStyles(({ palette }) => ({
  noUploadsText: {
    color: palette.action.disabled,
  },
}));

interface UploadItemsProps {
  removeUpload: (queueId: UploadFile['queueId']) => void;
  state: UploadState;
}

export const UploadItems: FC<UploadItemsProps> = (props) => {
  const {
    state: { submittedFiles },
    removeUpload,
  } = props;
  const areFilesUploading = submittedFiles.length > 0;
  const classes = useStyles();

  // const testFile = {
  //   completedAt: undefined,
  //   error: undefined,
  //   file: new File([''], 'filename', { type: 'text/html' }),
  //   fileName:
  //     'Expense Reimbursement Form - 2014-07 - And some other words here',
  //   percentCompleted: 80,
  //   queueId: 12345,
  //   uploadId: '12345',
  //   uploading: true,
  // };

  return (
    <>
      {areFilesUploading ? (
        <>
          {submittedFiles.map((file) => (
            <UploadItem
              key={file.queueId}
              file={file}
              onClear={() => removeUpload(file.queueId)}
            />
          ))}
        </>
      ) : (
        <Box marginTop={-1} p={2} textAlign="center">
          <Typography
            variant="h5"
            component="span"
            className={classes.noUploadsText}
          >
            No uploads
          </Typography>
        </Box>
      )}
    </>
    // <UploadItem
    //   key={testFile.queueId}
    //   file={testFile}
    //   onClear={() => removeUpload(testFile.queueId)}
    // />
  );
};
