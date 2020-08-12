import FileSaver from 'file-saver';
import { PartialDeep } from 'type-fest';
import { Directory, File, FileVersion } from '../../../api';

type DownloadableFile = PartialDeep<Directory | File | FileVersion>;

export const useDownloadFile = (): ((file: DownloadableFile) => void) => {
  const downloadFile = (file: DownloadableFile) => {
    // We'll construct this so that it can just swallow a
    // `Directory`, and rely on other mechanisms to avoid
    // passing it one for now. Later, this might be useful
    // for letting the user download an entire folder.
    const isDirectory = (
      file: DownloadableFile
    ): file is PartialDeep<Directory> => file.type === 'Directory';
    if (!isDirectory(file) && file.downloadUrl)
      FileSaver.saveAs(file.downloadUrl, file.name ?? undefined);
  };
  return downloadFile;
};
