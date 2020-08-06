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
import {
  useDeleteFileNodeMutation,
  useRequestFileUploadMutation,
} from './Upload.generated';
import { UploadItems } from './UploadItems';
import { UploadManager } from './UploadManager';

interface UploadContextValue {
  addFilesToUploadQueue: (files: Types.FileInput[]) => void;
}

const initialUploadContext = {
  addFilesToUploadQueue: () => null,
};

export const UploadContext = createContext<UploadContextValue>(
  initialUploadContext
);
UploadContext.displayName = 'UploadContext';

interface UploadManagerContextValue {
  isManagerOpen: boolean;
  setIsManagerOpen: (isOpen: boolean) => void;
}

const initialUploadManagerContext = {
  isManagerOpen: false,
  setIsManagerOpen: () => null,
};

export const UploadManagerContext = createContext<UploadManagerContextValue>(
  initialUploadManagerContext
);
UploadManagerContext.displayName = 'UploadManagerContext';

export const UploadProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const { setIsManagerOpen } = useUploadManager();
  const { submittedFiles } = state;
  const [deleteFile] = useDeleteFileNodeMutation();
  const [requestFileUpload] = useRequestFileUploadMutation();

  const addFilesToUploadQueue = useCallback(
    (files: Types.FileInput[]) => {
      dispatch({
        type: actions.FILES_SUBMITTED,
        files,
      });
      setIsManagerOpen(true);
    },
    [setIsManagerOpen]
  );

  const setUploadingStatus = useCallback(
    (
      queueId: Types.UploadFile['queueId'],
      uploading: Types.UploadFile['uploading']
    ) => dispatch({ type: actions.UPLOAD_STATUS_UPDATED, queueId, uploading }),
    []
  );

  const setUploadError = useCallback(
    (queueId: Types.UploadFile['queueId'], errorMessage: string) => {
      dispatch({
        type: actions.FILE_UPLOAD_ERROR_OCCURRED,
        queueId,
        error: new Error(errorMessage),
      });
    },
    []
  );

  const removeUpload = useCallback((queueId: Types.UploadFile['queueId']) => {
    dispatch({ type: actions.REMOVE_UPLOAD, queueId });
  }, []);

  const handleFileUploadSuccess = useCallback(
    async (file: Types.UploadFile) => {
      if (file?.callback && file?.uploadId) {
        const { callback, queueId, fileName, uploadId } = file;
        try {
          await callback(uploadId, fileName);
          dispatch({
            type: actions.FILE_UPLOAD_COMPLETED,
            queueId,
            completedAt: new Date(),
          });
          await sleep(10000);
          removeUpload(queueId);
        } catch (error) {
          setUploadError(file.queueId, 'Post-upload action failed');
          deleteFile({ variables: { id: file.uploadId } });
        }
      }
    },
    [deleteFile, removeUpload, setUploadError]
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
    []
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
            handleFileUploadSuccess(uploadFile);
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

  const handleFileAdded = useCallback(
    async (file: Types.UploadFile) => {
      const { data } = await requestFileUpload();
      const { id, url } = data?.requestFileUpload ?? { id: '', url: '' };
      if (id && url) {
        dispatch({
          type: actions.FILE_UPLOAD_REQUEST_SUCCEEDED,
          queueId: file.queueId,
          uploadId: id,
        });
        const updatedFile = {
          ...file,
          uploadId: id,
        };
        uploadFile(updatedFile, url);
      }
    },
    [requestFileUpload, uploadFile]
  );

  useEffect(() => {
    const filesNotStarted = submittedFiles.filter(
      (file) => !file.uploading && !file.completedAt
    );
    for (const file of filesNotStarted) {
      setUploadingStatus(file.queueId, true);
      handleFileAdded(file);
    }
  }, [submittedFiles, handleFileAdded, setUploadingStatus]);

  return (
    <UploadContext.Provider value={{ addFilesToUploadQueue }}>
      {children}
      <UploadManager>
        <UploadItems state={state} removeUpload={removeUpload} />
      </UploadManager>
    </UploadContext.Provider>
  );
};

export const UploadManagerProvider: FC = ({ children }) => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  return (
    <UploadManagerContext.Provider value={{ isManagerOpen, setIsManagerOpen }}>
      {children}
    </UploadManagerContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
export const useUploadManager = () => useContext(UploadManagerContext);
