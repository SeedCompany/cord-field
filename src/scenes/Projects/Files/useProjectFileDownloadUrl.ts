import { useApolloClient } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { FileDownloadUrl_Directory_Fragment } from '../../../components/files/FileActionsMenu';
import {
  ProjectFileNodeDownloadUrlDocument,
  ProjectFileNodeDownloadUrlQuery,
} from './ProjectFiles.generated';

export const useProjectFileDownloadUrl = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = useCallback(() => {
    enqueueSnackbar('Could not download file', {
      variant: 'error',
    });
  }, [enqueueSnackbar]);

  const client = useApolloClient();

  const queryDownloadUrl = useCallback(
    async (id: string): Promise<string> => {
      try {
        const { data } = await client.query<ProjectFileNodeDownloadUrlQuery>({
          query: ProjectFileNodeDownloadUrlDocument,
          variables: { id },
        });
        const isDirectory = (
          node: ProjectFileNodeDownloadUrlQuery['fileNode'] | undefined
        ): node is FileDownloadUrl_Directory_Fragment => {
          return node?.type === 'Directory';
        };
        return !isDirectory(data?.fileNode)
          ? data?.fileNode.downloadUrl ?? ''
          : '';
      } catch (error) {
        console.log(error);
        showSnackbarError();
        return '';
      }
    },
    [client, showSnackbarError]
  );
  return queryDownloadUrl;
};
