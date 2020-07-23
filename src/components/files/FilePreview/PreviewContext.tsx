import React, { createContext, FC, useContext, useState } from 'react';

interface PreviewContextValue {
  previewError: string;
  setPreviewError: (message: string) => void;
  previewPage: number;
  setPreviewPage: (page: number) => void;
}

export const PreviewContext = createContext<PreviewContextValue>({
  previewError: '',
  setPreviewError: () => null,
  previewPage: 1,
  setPreviewPage: () => null,
});

export const PreviewContextProvider: FC = ({ children }) => {
  const [previewError, setPreviewError] = useState('');
  const [previewPage, setPreviewPage] = useState(1);

  return (
    <PreviewContext.Provider
      value={{ previewError, setPreviewError, previewPage, setPreviewPage }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);
