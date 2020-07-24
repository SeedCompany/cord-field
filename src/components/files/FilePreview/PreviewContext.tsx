import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';

interface PreviewContextValue {
  previewError: string;
  setPreviewError: (message: string) => void;
  previewLoading: boolean;
  setPreviewLoading: (isLoading: boolean) => void;
  previewPage: number;
  setPreviewPage: (page: number) => void;
}

export const initialPreviewContext = {
  previewError: '',
  setPreviewError: () => null,
  previewLoading: false,
  setPreviewLoading: () => null,
  previewPage: 1,
  setPreviewPage: () => null,
};

export const PreviewContext = createContext<PreviewContextValue>(
  initialPreviewContext
);

export const PreviewContextProvider: FC = ({ children }) => {
  const [previewError, setPreviewError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);

  return (
    <PreviewContext.Provider
      value={{
        previewError,
        setPreviewError,
        previewLoading,
        setPreviewLoading,
        previewPage,
        setPreviewPage,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);

export const usePreviewError = () => {
  const { setPreviewError, setPreviewLoading } = usePreview();
  const handlePreviewError = useCallback(
    (error: string) => {
      setPreviewError(error);
      setPreviewLoading(false);
    },
    [setPreviewError, setPreviewLoading]
  );
  return handlePreviewError;
};
