import MsgReader from '@freiraum/msgreader';
import { fromBuffer as fileTypeFromBuffer } from 'file-type/browser';
import { lookup } from 'mime-types';

// file-type only inspects the file's signature bytes, not its full contents.
// This matches file-type's own internal `minimumBytes` threshold for reliable
// detection, so we never need to read more than this from disk/memory.
const FILE_TYPE_SNIFF_BYTES = 4100;

// Outlook .msg files (and legacy pre-2007 .doc/.xls/.ppt) are OLE Compound
// File Binary Format documents, which always start with this fixed signature.
const OLE_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

export const getMimeType = async (file: File) => {
  const fromOS = file.type;
  if (fromOS && !file.name.endsWith('.msg')) {
    return fromOS;
  }

  const fromFileName = lookup(file.name) || undefined;
  if (fromFileName) {
    return fromFileName;
  }

  // MsgReader has to walk the compound file's FAT/directory structure to
  // tell an Outlook message apart from other OLE-based formats, which can
  // require random access anywhere in the file - it can't be satisfied with
  // a small slice like file-type's signature check below. To avoid reading
  // arbitrarily large files fully into memory just to rule this out, we only
  // pay that cost for files that start with the OLE signature, which is rare
  // once name/OS-reported types are exhausted and is only ever used by these
  // small, bounded legacy document formats.
  if (await hasOleSignature(file)) {
    const buffer = await file.arrayBuffer();
    const isEmail = !new MsgReader(buffer).getFileData().error;
    if (isEmail) {
      return 'application/vnd.ms-outlook';
    }
  }

  const sniff = await file.slice(0, FILE_TYPE_SNIFF_BYTES).arrayBuffer();
  const fromBinary = await fileTypeFromBuffer(sniff);
  if (fromBinary) {
    return fromBinary.mime;
  }

  return 'application/octet-stream';
};

const hasOleSignature = async (file: File) => {
  const header = new Uint8Array(
    await file.slice(0, OLE_SIGNATURE.length).arrayBuffer()
  );
  return OLE_SIGNATURE.every((byte, index) => header[index] === byte);
};
