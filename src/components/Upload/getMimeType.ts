import MsgReader from '@freiraum/msgreader';
import { fromBuffer as fileTypeFromBuffer } from 'file-type/browser';
import { lookup } from 'mime-types';

export const getMimeType = async (file: File) => {
  const fromOS = file.type;
  if (fromOS && !file.name.endsWith('.msg')) {
    return fromOS;
  }

  const fromFileName = lookup(file.name) || undefined;
  if (fromFileName) {
    return fromFileName;
  }

  const buffer = await file.arrayBuffer();

  const isEmail = !new MsgReader(buffer).getFileData().error;
  if (isEmail) {
    return 'application/vnd.ms-outlook';
  }

  const fromBinary = await fileTypeFromBuffer(buffer);
  if (fromBinary) {
    return fromBinary.mime;
  }

  return 'application/octet-stream';
};
