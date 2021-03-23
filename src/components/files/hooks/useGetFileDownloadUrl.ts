import { useApolloClient } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { FileNodeDownloadUrlDocument } from './DownloadFile.generated';

export const useGetFileDownloadUrl = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = useCallback(() => {
    enqueueSnackbar('Could not download file', {
      variant: 'error',
    });
  }, [enqueueSnackbar]);

  const client = useApolloClient();

  const getFileDownloadUrl = useCallback(
    async (id: string): Promise<string | null> => {
      try {
        const { data } = await client.query({
          query: FileNodeDownloadUrlDocument,
          variables: { id },
          // We don't want to retrieve this from cache because the
          // pre-signed URL might have expired while the user kept the
          // tab open past 15 minutes.
          fetchPolicy: 'network-only',
        });
        return data.fileNode.__typename === 'File' ||
          data.fileNode.__typename === 'FileVersion'
          ? data.fileNode.downloadUrl
          : null;
      } catch {
        showSnackbarError();
        return null;
      }
    },
    [showSnackbarError, client]
  );
  return getFileDownloadUrl;
};
