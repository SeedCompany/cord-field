import { useSnackbar } from 'notistack';
import { PartialDeep } from 'type-fest';
import { Directory, File, FileVersion } from '../../../api';
import { saveAs } from '../../../common/FileSaver';
import { useGetFileDownloadUrl } from './useGetFileDownloadUrl';

type DownloadableFile = PartialDeep<Directory | File | FileVersion>;

export const useDownloadFile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarError = () => {
    enqueueSnackbar('Could not download file', {
      variant: 'error',
    });
  };

  const getFileDownloadUrl = useGetFileDownloadUrl();

  const downloadFile = async (file: DownloadableFile) => {
    // We'll construct this so that it can just swallow a
    // `Directory`, and rely on other mechanisms to avoid
    // passing it one for now. Later, this might be useful
    // for letting the user download an entire folder.
    const isDirectory = (
      file: DownloadableFile
    ): file is PartialDeep<Directory> => file.type === 'Directory';
    if (!isDirectory(file)) {
      try {
        const downloadUrl = await getFileDownloadUrl(file.id!);
        if (downloadUrl) {
          saveAs(downloadUrl, file.name ?? undefined, { skipCorsCheck: true });
        }
      } catch {
        showSnackbarError();
      }
    }
  };
  return downloadFile;
};
