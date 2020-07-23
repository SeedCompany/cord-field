import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useRetrieveFile = (errorHandler?: () => void) => {
  const { enqueueSnackbar } = useSnackbar();
  const showFileRetrievalError = useCallback(() => {
    enqueueSnackbar('Could not retrieve file', {
      variant: 'error',
    });
  }, [enqueueSnackbar]);
  const retrieveFile = useCallback(
    async (url: string): Promise<File | null> => {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          return new File([await response.blob()], 'Preview');
        } else {
          errorHandler ? errorHandler() : showFileRetrievalError();
          return null;
        }
      } catch {
        errorHandler ? errorHandler() : showFileRetrievalError();
        return null;
      }
    },
    [errorHandler, showFileRetrievalError]
  );

  return retrieveFile;
};
