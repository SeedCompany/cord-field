import { useCallback } from 'react';
import { usePreview } from './PreviewContext';

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
