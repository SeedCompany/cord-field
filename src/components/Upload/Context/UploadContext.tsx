import React, { createContext, FC, useContext } from 'react';
import { useRequestFileUploadMutation } from '../Upload.generated';

type UploadStatus = 'idle' | 'adding' | 'added' | 'uploading' | 'completed';

interface UploadContextValue {
  addedFiles: File[];
  submittedFiles: File[];
  status: UploadStatus;
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
  const [requestFileUpload] = useRequestFileUploadMutation();

  function handleFileProgress(event: ProgressEvent) {
    const { loaded, total } = event;
    const percentCompleted = Math.floor((loaded / total) * 1000) / 10;
    if (percentCompleted >= 100) {
      console.log('Done');
    } else {
      console.log(`Percentage completed: ${percentCompleted}%`);
    }
  }

  function uploadFile(file: File, url: string) {
    const payload = new FormData();
    payload.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = handleFileProgress;
    xhr.open('PUT', url);
    xhr.send(payload);
  }

  /* eslint-disable */
  async function handleFileUpload(file: File) {
    const { data } = await requestFileUpload();
    const { /* id, */ url } = data?.requestFileUpload ?? { id: '', url: '' };
    uploadFile(file, url);
  }

  return uploadContext ? { ...uploadContext } : undefined;
};
