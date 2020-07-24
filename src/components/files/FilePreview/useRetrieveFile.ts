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
    async (
      url: string,
      callback: (file: File) => Promise<void>,
      errorHandler?: () => void
    ): Promise<void> => {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          callback(new File([await response.blob()], 'Preview'));
        } else {
          errorHandler ? errorHandler() : showSnackbarError();
        }
      } catch {
        errorHandler ? errorHandler() : showSnackbarError();
      }
    },
    [showSnackbarError]
  );

  return retrieveFile;
};
