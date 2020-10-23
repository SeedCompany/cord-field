import { useMutation } from '@apollo/client';
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
import { RequestFileUploadDocument } from './Upload.generated';
import { UploadItems } from './UploadItems';
import { UploadManager } from './UploadManager';
import { useUploadManager } from './UploadManagerContext';
import { useUploadFile } from './useUploadFile';

const initialUploadContext = {
  addFilesToUploadQueue: (_: Types.FileInput[]) => {
    return;
  },
  removeCompletedUploads: () => {
    return;
  },
};

export const UploadContext = createContext<typeof initialUploadContext>(
  initialUploadContext
);
UploadContext.displayName = 'UploadContext';

export const UploadProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const { setIsManagerOpen } = useUploadManager();
  const { submittedFiles } = state;
  const [requestFileUpload] = useMutation(RequestFileUploadDocument);
  const uploadFile = useUploadFile(dispatch);

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

  const removeUpload = useCallback((queueId: Types.UploadFile['queueId']) => {
    dispatch({ type: actions.REMOVE_UPLOAD, queueId });
  }, []);

  const removeCompletedUploads = useCallback(() => {
    dispatch({ type: actions.REMOVE_COMPLETED_UPLOADS });
  }, []);

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
      void handleFileAdded(file);
    }
  }, [submittedFiles, handleFileAdded, setUploadingStatus]);

  return (
    <UploadContext.Provider
      value={{ addFilesToUploadQueue, removeCompletedUploads }}
    >
      {children}
      <UploadManager removeCompletedUploads={removeCompletedUploads}>
        <UploadItems state={state} removeUpload={removeUpload} />
      </UploadManager>
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
