import React, { createContext, FC, useContext, useState } from 'react';

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

export const UploadManagerProvider: FC = ({ children }) => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  return (
    <UploadManagerContext.Provider value={{ isManagerOpen, setIsManagerOpen }}>
      {children}
    </UploadManagerContext.Provider>
  );
};

export const useUploadManager = () => useContext(UploadManagerContext);
