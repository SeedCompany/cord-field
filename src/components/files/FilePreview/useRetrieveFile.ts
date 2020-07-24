import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useRetrieveFile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = useCallback(() => {
    enqueueSnackbar('Could not retrieve file', {
      variant: 'error',
    });
  }, [enqueueSnackbar]);

  const retrieveFile = useCallback(
    async (url: string, errorHandler?: () => void): Promise<File | null> => {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          return new File([await response.blob()], 'Preview');
        } else {
          errorHandler ? errorHandler() : showSnackbarError();
          return null;
        }
      } catch {
        errorHandler ? errorHandler() : showSnackbarError();
        return null;
      }
    },
    [showSnackbarError]
  );

  return retrieveFile;
};
