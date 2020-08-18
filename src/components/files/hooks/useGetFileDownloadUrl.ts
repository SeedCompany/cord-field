import { useApolloClient } from '@apollo/client';
import { useSnackbar } from 'notistack';
import {
  FileDownloadUrl_Directory_Fragment,
  FileNodeDownloadUrlDocument,
  FileNodeDownloadUrlQuery,
} from '../FileActions';

export const useGetFileDownloadUrl = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = () => {
    enqueueSnackbar('Could not download file', {
      variant: 'error',
    });
  };

  const client = useApolloClient();

  const getFileDownloadUrl = async (id: string): Promise<string> => {
    try {
      const { data } = await client.query<FileNodeDownloadUrlQuery>({
        query: FileNodeDownloadUrlDocument,
        variables: { id },
        fetchPolicy: 'network-only',
      });
      const isDirectory = (
        node: FileNodeDownloadUrlQuery['fileNode'] | undefined
      ): node is FileDownloadUrl_Directory_Fragment => {
        return node?.type === 'Directory';
      };
      return !isDirectory(data?.fileNode)
        ? data?.fileNode.downloadUrl ?? ''
        : '';
    } catch {
      showSnackbarError();
      return '';
    }
  };
  return getFileDownloadUrl;
};
