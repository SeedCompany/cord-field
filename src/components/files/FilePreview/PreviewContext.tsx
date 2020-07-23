import React, { createContext, FC, useContext, useState } from 'react';

interface PreviewContextValue {
  previewError: string;
  setPreviewError: (message: string) => void;
}

export const PreviewContext = createContext<PreviewContextValue>({
  previewError: '',
  setPreviewError: () => null,
});

export const PreviewContextProvider: FC = ({ children }) => {
  const [previewError, setPreviewError] = useState('');

  return (
    <PreviewContext.Provider value={{ previewError, setPreviewError }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);
