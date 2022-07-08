import React, { createContext, useContext, useState } from 'react';
import { ChildrenProp } from '~/common';

const initialUploadManagerContext = {
  isManagerOpen: false,
  setIsManagerOpen: (_: boolean) => {
    return;
  },
};

export const UploadManagerContext = createContext<
  typeof initialUploadManagerContext
>(initialUploadManagerContext);
UploadManagerContext.displayName = 'UploadManagerContext';

export const UploadManagerProvider = ({ children }: ChildrenProp) => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  return (
    <UploadManagerContext.Provider value={{ isManagerOpen, setIsManagerOpen }}>
      {children}
    </UploadManagerContext.Provider>
  );
};

export const useUploadManager = () => useContext(UploadManagerContext);
