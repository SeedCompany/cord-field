import MsgReader from '@freiraum/msgreader';

export const getMimeType = async (file: File) => {
  const mimeType = file.type;
  if (mimeType && !file.name.endsWith('.msg')) {
    return mimeType;
  }

  const data = new MsgReader(await file.arrayBuffer()).getFileData();
  if (!data.error) {
    return 'application/vnd.ms-outlook';
  }

  return mimeType;
};
