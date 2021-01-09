import { useApolloClient } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import {
  FileDownloadUrl_Directory_Fragment,
  FileNodeDownloadUrlDocument,
  FileNodeDownloadUrlQuery,
} from './DownloadFile.generated';

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
        const { data } = await client.query<FileNodeDownloadUrlQuery>({
          query: FileNodeDownloadUrlDocument,
          variables: { id },
          // We don't want to retrieve this from cache because the
          // presigned URL might have expired while the user kept the
          // tab open past 15 minutes.
          fetchPolicy: 'network-only',
        });
        const isDirectory = (
          node: FileNodeDownloadUrlQuery['fileNode'] | undefined
        ): node is FileDownloadUrl_Directory_Fragment => {
          return node?.type === 'Directory';
        };
        return !isDirectory(data?.fileNode)
          ? data?.fileNode.downloadUrl ?? null
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
