import MsgReader from '@freiraum/msgreader';
import { fromBuffer as fileTypeFromBuffer } from 'file-type/browser';
import { lookup } from 'mime-types';

// Matches file-type's own internal minimum for reliable signature detection.
const FILE_TYPE_SNIFF_BYTES = 4100;

// Signature for OLE Compound File Binary Format (.msg, legacy .doc/.xls/.ppt).
const OLE_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

// Bounds how much memory the MsgReader check below can use. Real .msg/.doc/
// .xls/.ppt files are well under this; anything bigger skips straight to the
// file-type sniff (which still resolves OLE files as `application/x-cfb`).
const MAX_OLE_PARSE_BYTES = 50 * 1024 * 1024; // 50 MiB

export const getMimeType = async (file: File) => {
  const fromOS = file.type;
  if (fromOS && !file.name.endsWith('.msg')) {
    return fromOS;
  }

  const fromFileName = lookup(file.name) || undefined;
  if (fromFileName) {
    return fromFileName;
  }

  // MsgReader needs the whole buffer to walk the compound file's directory
  // structure - it can't work off a slice - so we gate it on size + signature.
  if (file.size <= MAX_OLE_PARSE_BYTES && (await hasOleSignature(file))) {
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
