import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { useRequestFileUploadMutation } from '../Upload.generated';
import * as actions from './uploadActions';
import { initialState } from './uploadInitialState';
import { uploadReducer } from './uploadReducer';
import * as Types from './uploadTypings';

interface UploadContextValue {
  files: Types.UploadFile[];
  addFileToUploadQueue: (file: File) => void;
}

export const UploadContext = createContext<UploadContextValue | undefined>(
  undefined
);
UploadContext.displayName = 'UploadContext';

export const UploadProvider: FC = ({ children }) => (
  <UploadContext.Provider value={useUpload()}>
    {children}
  </UploadContext.Provider>
);

export const useUpload = () => {
  const uploadContext = useContext(UploadContext);
  const [{ files }, dispatch] = useReducer(uploadReducer, initialState);
  const [requestFileUpload] = useRequestFileUploadMutation();

  const uploadFile = useCallback((file: Types.UploadFile, url: string) => {
    const payload = new FormData();
    payload.append('file', file.file);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = handleFileProgress.bind(null, file.uploadId);
    xhr.open('PUT', url);
    xhr.send(payload);
  }, []);

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
    if (percentCompleted >= 100) {
      console.log('Done');
      dispatch({
        type: actions.FILE_UPLOAD_COMPLETED,
        id,
        completedAt: new Date(),
      });
    } else {
      console.log(`Percentage completed: ${percentCompleted}%`);
      dispatch({
        type: actions.PERCENT_COMPLETED_UPDATED,
        id,
        percentCompleted,
      });
    }
  }

  function addFileToUploadQueue(file: File /* TODO: pass in callback */) {
    dispatch({ type: actions.FILE_SUBMITTED, file });
  }

  return uploadContext
    ? { ...uploadContext, files, addFileToUploadQueue }
    : undefined;
};
