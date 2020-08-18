import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { SupportedType } from '../FILE_MIME_TYPES';

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
      type: SupportedType,
      callback: (file: File) => void | Promise<void>,
      errorHandler?: () => void
    ): Promise<void> => {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          void callback(
            new File([await response.blob()], 'Preview', {
              type,
            })
          );
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
