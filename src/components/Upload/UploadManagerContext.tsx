import { createContext, useContext, useMemo, useState } from 'react';
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
  const context = useMemo(
    () => ({ isManagerOpen, setIsManagerOpen }),
    [isManagerOpen, setIsManagerOpen]
  );
  return (
    <UploadManagerContext.Provider value={context}>
      {children}
    </UploadManagerContext.Provider>
  );
};

export const useUploadManager = () => useContext(UploadManagerContext);
