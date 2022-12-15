import { Dispatch, useCallback } from 'react';
import * as actions from './Reducer/uploadActions';
import * as Types from './Reducer/uploadTypings';

export const useUploadFile = (
  dispatch: Dispatch<Types.UploadAction>
): ((uploadFile: Types.UploadFile, url: string) => void) => {
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
          setUploadError(file.queueId, 'Failed to save file');
          console.error(error);
        }
      }
    },
    [setUploadError, dispatch]
  );

  const uploadFile = useCallback(
    (upload: Types.UploadFile, url: string) => {
      void putToS3({
        url,
        body: upload.file,
        onProgress: (event) => {
          dispatch({
            type: actions.PERCENT_COMPLETED_UPDATED,
            queueId: upload.queueId,
            percentCompleted:
              Math.floor((event.loaded / event.total) * 1000) / 10,
          });
        },
      })
        .then(() => handleFileUploadSuccess(upload))
        .catch((e) => {
          let message = 'Upload failed';
          if (e instanceof DOMException && e.name === 'NotFoundError') {
            message = `File not found on your computer`;
          }
          setUploadError(upload.queueId, message);
          console.error(e);
        });
    },
    [handleFileUploadSuccess, setUploadError, dispatch]
  );
  return uploadFile;
};

const putToS3 = async ({
  url,
  body,
  onProgress,
}: {
  url: string;
  body: File;
  onProgress: (ev: ProgressEvent) => void;
}) => {
  const mimeType = await (await import('./getMimeType')).getMimeType(body);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve();
        } else {
          reject(new Error(`${xhr.status}: ${xhr.statusText}`));
        }
      }
    };
    xhr.onprogress = onProgress;
    xhr.onerror = reject;
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', mimeType);
    xhr.send(body);
  });
};
