import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useRetrieveFile = () => {
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
          showFileRetrievalError();
          return null;
        }
      } catch {
        showFileRetrievalError();
        return null;
      }
    },
    [showFileRetrievalError]
  );

  return retrieveFile;
};
