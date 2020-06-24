import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import * as actions from './Reducer/uploadActions';
import { initialState } from './Reducer/uploadInitialState';
import { uploadReducer } from './Reducer/uploadReducer';
import * as Types from './Reducer/uploadTypings';
import { useRequestFileUploadMutation } from './Upload.generated';
import { UploadManager } from './UploadManager';

interface FileInput {
  file: File;
  uploadId: string;
  fileName: string;
  callback: Types.UploadCallback;
}

interface UploadContextValue {
  addFileToUploadQueue: (input: FileInput) => void;
}

export const UploadContext = createContext<UploadContextValue | undefined>(
  undefined
);
UploadContext.displayName = 'UploadContext';

export const UploadProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const { files } = state;
  const [requestFileUpload] = useRequestFileUploadMutation();

  const addFileToUploadQueue = useCallback(
    ({ file, uploadId, fileName, callback }) => {
      const newFile = {
        ...(callback ? { callback } : null),
        file,
        fileName,
        percentCompleted: 0,
        uploadId,
        uploading: false,
      };
      dispatch({
        type: actions.FILE_SUBMITTED,
        file: newFile,
      });
    },
    []
  );

  const setUploadingStatus = useCallback(
    (
      id: Types.UploadFile['uploadId'],
      uploading: Types.UploadFile['uploading']
    ) => dispatch({ type: actions.UPLOAD_STATUS_UPDATED, id, uploading }),
    []
  );

  const handleFileUploadSuccess = useCallback(
    (response, id) => {
      console.info(`UPLOAD RESPONSE -> ${JSON.stringify(response)}`);

      const uploadedFile = files.find((file) => file.uploadId === id);
      if (uploadedFile?.callback) {
        const { callback, uploadId, fileName } = uploadedFile;
        callback(uploadId, fileName).then(() =>
          dispatch({
            type: actions.FILE_UPLOAD_COMPLETED,
            id,
            completedAt: new Date(),
          })
        );
      }
    },
    [files]
  );

  const handleFileUploadError = useCallback((statusText, id) => {
    console.error(`UPLOAD ERROR -> ${JSON.stringify(statusText)}`);
    dispatch({
      type: actions.FILE_UPLOAD_ERROR_OCCURRED,
      id,
      error: new Error(statusText),
    });
  }, []);

  const uploadFile = useCallback(
    (file: Types.UploadFile, url: string) => {
      const { uploadId } = file;
      const payload = new FormData();
      payload.append('file', file.file);
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const { status } = xhr;
          const success = status === 0 || (status >= 200 && status < 400);
          if (success) {
            const { responseType } = xhr;
            const response =
              !responseType || responseType === 'text'
                ? xhr.responseText
                : responseType === 'document'
                ? xhr.responseXML
                : xhr.response;
            handleFileUploadSuccess(response, uploadId);
          } else {
            handleFileUploadError(xhr.statusText, uploadId);
          }
        }
      };

      xhr.upload.onprogress = handleFileProgress.bind(null, uploadId);
      xhr.open('PUT', url);
      xhr.send(payload);
      setUploadingStatus(uploadId, true);
    },
    [handleFileUploadSuccess, handleFileUploadError, setUploadingStatus]
  );

  const handleFileAdded = useCallback(
    async (file: Types.UploadFile) => {
      const { data } = await requestFileUpload();
      const { /* id, */ url } = data?.requestFileUpload ?? { id: '', url: '' };
      uploadFile(file, url);
    },
    [requestFileUpload, uploadFile]
  );

  // Very simple for now. We immediately submit all files to be uploaded
  useEffect(() => {
    const filesNotStarted = files.filter(
      (file) => !file.uploading && !file.completedAt
    );
    for (const file of filesNotStarted) {
      handleFileAdded(file);
    }
  }, [files, handleFileAdded]);

  function handleFileProgress(
    id: Types.UploadFile['uploadId'],
    event: ProgressEvent
  ) {
    const { loaded, total } = event;
    const percentCompleted = Math.floor((loaded / total) * 1000) / 10;
    console.log(`Percentage completed: ${percentCompleted}%`);
    dispatch({
      type: actions.PERCENT_COMPLETED_UPDATED,
      id,
      percentCompleted,
    });
  }

  return (
    <UploadContext.Provider value={{ addFileToUploadQueue }}>
      {children}
      <UploadManager state={state} />
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
