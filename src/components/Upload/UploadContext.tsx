import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { sleep } from '../../util/sleep';
import * as actions from './Reducer/uploadActions';
import { initialState } from './Reducer/uploadInitialState';
import { uploadReducer } from './Reducer/uploadReducer';
import * as Types from './Reducer/uploadTypings';
import { useRequestFileUploadMutation } from './Upload.generated';
import { UploadManager } from './UploadManager';

interface UploadContextValue {
  addFilesToUploadQueue: (files: Types.FileInput[]) => void;
  isManagerOpen: boolean;
  setIsManagerOpen: (isOpen: boolean) => void;
}

const initialContext = {
  addFilesToUploadQueue: () => null,
  isManagerOpen: false,
  setIsManagerOpen: () => null,
};

export const UploadContext = createContext<UploadContextValue>(initialContext);
UploadContext.displayName = 'UploadContext';

export const UploadProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const [isManagerOpen, setIsManagerOpen] = useState(true);
  const { submittedFiles } = state;
  const [requestFileUpload] = useRequestFileUploadMutation();

  useEffect(() => {
    const areFilesUploading = submittedFiles.length > 0;
    if (areFilesUploading && !isManagerOpen) {
      setIsManagerOpen(true);
    }
  }, [submittedFiles, isManagerOpen, setIsManagerOpen]);

  const addFilesToUploadQueue = useCallback((files: Types.FileInput[]) => {
    console.log('SETTING SUBMITTED FILES');
    dispatch({
      type: actions.FILES_SUBMITTED,
      files,
    });
  }, []);

  const setUploadingStatus = useCallback(
    (
      queueId: Types.UploadFile['queueId'],
      uploading: Types.UploadFile['uploading']
    ) => dispatch({ type: actions.UPLOAD_STATUS_UPDATED, queueId, uploading }),
    []
  );

  const handleFileUploadSuccess = useCallback(
    (response, file: Types.UploadFile) => {
      console.info(`UPLOAD RESPONSE -> ${JSON.stringify(response)}`);

      if (file?.callback && file?.uploadId) {
        const { callback, queueId, fileName, uploadId } = file;
        callback(uploadId, fileName).then(() => {
          console.log('SETTING UPLOAD COMPLETED');
          dispatch({
            type: actions.FILE_UPLOAD_COMPLETED,
            queueId,
            completedAt: new Date(),
          });
          sleep(10000);
          console.log('REMOVING COMPLETED UPLOAD');
          dispatch({
            type: actions.REMOVE_COMPLETED_UPLOAD,
            queueId,
          });
        });
      }
    },
    []
  );

  const handleFileUploadError = useCallback((statusText, queueId) => {
    console.error(`UPLOAD ERROR -> ${JSON.stringify(statusText)}`);
    console.log('SETTING UPLOAD ERROR');
    dispatch({
      type: actions.FILE_UPLOAD_ERROR_OCCURRED,
      queueId,
      error: new Error(statusText),
    });
  }, []);

  const handleFileProgress = useCallback(
    (queueId: Types.UploadFile['queueId'], event: ProgressEvent) => {
      const { loaded, total } = event;
      const percentCompleted = Math.floor((loaded / total) * 1000) / 10;
      console.log(`Percentage completed: ${percentCompleted}%`);
      console.log('SETTING PERCENT COMPLETED');
      dispatch({
        type: actions.PERCENT_COMPLETED_UPDATED,
        queueId,
        percentCompleted,
      });
    },
    []
  );

  const uploadFile = useCallback(
    (file: Types.UploadFile, url: string) => {
      const { queueId } = file;
      const payload = new FormData();
      payload.append('file', file.file);
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const { status } = xhr;
          console.log('status', status);
          const success = status === 0 || (status >= 200 && status < 400);
          if (success) {
            const { responseType } = xhr;
            const response =
              !responseType || responseType === 'text'
                ? xhr.responseText
                : responseType === 'document'
                ? xhr.responseXML
                : xhr.response;
            handleFileUploadSuccess(response, file);
          } else {
            handleFileUploadError(xhr.statusText, queueId);
          }
        }
      };

      xhr.upload.onprogress = handleFileProgress.bind(null, queueId);
      xhr.open('PUT', url);
      xhr.send(payload);
    },
    [handleFileUploadSuccess, handleFileUploadError, handleFileProgress]
  );

  const handleFileAdded = useCallback(
    async (file: Types.UploadFile) => {
      const { data } = await requestFileUpload();
      const { id, url } = data?.requestFileUpload ?? { id: '', url: '' };
      if (id && url) {
        console.log('SETTING UPLOAD REQUEST SUCCEEDED');
        dispatch({
          type: actions.FILE_UPLOAD_REQUEST_SUCCEEDED,
          queueId: file.queueId,
          uploadId: id,
        });
        uploadFile(file, url);
      }
    },
    [requestFileUpload, uploadFile]
  );

  useEffect(() => {
    const filesNotStarted = submittedFiles.filter(
      (file) => !file.uploading && !file.completedAt
    );
    for (const file of filesNotStarted) {
      console.log('SETTING UPLOAD STATUS');
      setUploadingStatus(file.queueId, true);
      handleFileAdded(file);
    }
  }, [submittedFiles, handleFileAdded, setUploadingStatus]);

  return (
    <UploadContext.Provider
      value={{ addFilesToUploadQueue, isManagerOpen, setIsManagerOpen }}
    >
      {children}
      <UploadManager
        isOpen={isManagerOpen}
        setIsOpen={setIsManagerOpen}
        state={state}
      />
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
