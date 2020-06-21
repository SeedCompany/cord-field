import React, { createContext, FC, useContext } from 'react';

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
  <UploadContext.Provider value={useUploader()}>
    {children}
  </UploadContext.Provider>
);

export const useUploader = () => {
  const uploadContext = useContext(UploadContext);
  return uploadContext ? { ...uploadContext } : undefined;
};
