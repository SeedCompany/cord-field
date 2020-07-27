import FileSaver from 'file-saver';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';
import { Directory, File, FileVersion } from '../../../api';
import { useProjectFileDownloadUrl } from '../../../scenes/Projects/Files';

type DownloadableFile = PartialDeep<Directory | File | FileVersion>;

export const useDownloadFile = (): ((file: DownloadableFile) => void) => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = useCallback(() => {
    enqueueSnackbar('Could not download file', {
      variant: 'error',
    });
  }, [enqueueSnackbar]);

  const queryDownloadUrl = useProjectFileDownloadUrl();

  const downloadFile = useCallback(
    async (file: DownloadableFile) => {
      // We'll construct this so that it can just swallow a
      // `Directory`, and rely on other mechanisms to avoid
      // passing it one for now. Later, this might be useful
      // for letting the user download an entire folder.
      const isDirectory = (
        file: DownloadableFile
      ): file is PartialDeep<Directory> => file.type === 'Directory';
      if (!isDirectory(file)) {
        try {
          const downloadUrl = await queryDownloadUrl(file.id!);
          if (downloadUrl)
            FileSaver.saveAs(downloadUrl, file.name ?? undefined);
        } catch {
          showSnackbarError();
        }
      }
    },
    [queryDownloadUrl, showSnackbarError]
  );
  return downloadFile;
};
