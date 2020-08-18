import { useSnackbar } from 'notistack';
import { SupportedType } from '../FILE_MIME_TYPES';

export const useRetrieveFile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = () => {
    enqueueSnackbar('Could not retrieve file', {
      variant: 'error',
    });
  };

  const retrieveFile = async (
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
  };

  return retrieveFile;
};
