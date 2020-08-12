import { Dispatch, useCallback } from 'react';
import * as actions from './Reducer/uploadActions';
import * as Types from './Reducer/uploadTypings';
import { useDeleteFileNodeMutation } from './Upload.generated';

export const useUploadFile = (
  dispatch: Dispatch<Types.UploadAction>
): ((uploadFile: Types.UploadFile, url: string) => void) => {
  const [deleteFile] = useDeleteFileNodeMutation();

  const setUploadError = useCallback(
    (queueId: Types.UploadFile['queueId'], errorMessage: string) => {
      dispatch({
        type: actions.FILE_UPLOAD_ERROR_OCCURRED,
        queueId,
        error: new Error(errorMessage),
      });
    },
    [dispatch]
  );

  const handleFileUploadSuccess = useCallback(
    async (file: Types.UploadFile) => {
      if (file.callback && file.uploadId) {
        const { callback, queueId, fileName, uploadId } = file;
        try {
          await callback(uploadId, fileName);
          dispatch({
            type: actions.FILE_UPLOAD_COMPLETED,
            queueId,
            completedAt: new Date(),
          });
        } catch (error) {
          setUploadError(file.queueId, 'Post-upload action failed');
          await deleteFile({ variables: { id: file.uploadId } });
        }
      }
    },
    [deleteFile, setUploadError, dispatch]
  );

  // This should be rare, it's just there for completeness.
  // It only runs if upload is complete but status isn't a "success" status.
  const handleFileUploadCompleteError = useCallback(
    (statusText, queueId) => {
      setUploadError(queueId, statusText);
    },
    [setUploadError]
  );

  // This is the error handler that will actually run on errors
  const handleUploadError = useCallback(
    (queueId: Types.UploadFile['queueId']) => {
      setUploadError(queueId, 'Upload failed');
    },
    [setUploadError]
  );

  const handleFileProgress = useCallback(
    (queueId: Types.UploadFile['queueId'], event: ProgressEvent) => {
      const { loaded, total } = event;
      const percentCompleted = Math.floor((loaded / total) * 1000) / 10;
      dispatch({
        type: actions.PERCENT_COMPLETED_UPDATED,
        queueId,
        percentCompleted,
      });
    },
    [dispatch]
  );

  const uploadFile = useCallback(
    (uploadFile: Types.UploadFile, url: string) => {
      const { queueId, file } = uploadFile;
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const { status } = xhr;
          const success = status >= 200 && status < 400;
          if (success) {
            void handleFileUploadSuccess(uploadFile);
          } else {
            handleFileUploadCompleteError(xhr.statusText, queueId);
          }
        }
      };

      xhr.upload.onprogress = handleFileProgress.bind(null, queueId);
      xhr.upload.onerror = () => handleUploadError(queueId);
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    },
    [
      handleFileUploadSuccess,
      handleFileUploadCompleteError,
      handleFileProgress,
      handleUploadError,
    ]
  );
  return uploadFile;
};
