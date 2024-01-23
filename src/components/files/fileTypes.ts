import {
  GraphicEq as AudioIcon,
  Description as DocumentIcon,
  Email as EmailIcon,
  Folder as FolderIcon,
  Image as ImageIcon,
  InsertDriveFile as OtherIcon,
  PictureAsPdf as PdfIcon,
  TableChart as SpreadsheetIcon,
  SvgIconComponent,
  VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import { mapKeys } from '@seedcompany/common';
import { ComponentType } from 'react';
import { Previewer, PreviewerProps } from './FilePreview';

export const getDirectoryComponents = () =>
  getFileComponents(fakeDirectoryMimeType);

export const getFileComponents = (mimeType: string) => ({
  mimeType,
  Icon: OtherIcon,
  Previewer: Previewer.NotSupported,
  ...fileTypes.get(mimeType),
});

const fakeDirectoryMimeType = 'directory';

interface FileType {
  mimeType: string;
  Icon: SvgIconComponent;
  Previewer?: ComponentType<PreviewerProps>;
}

const fileTypes = mapKeys.fromList<FileType, string>(
  [
    {
      mimeType: fakeDirectoryMimeType,
      Icon: FolderIcon,
    },
    {
      mimeType: 'application/vnd.ms-outlook',
      Icon: EmailIcon,
      Previewer: Previewer.Email,
    },
    {
      mimeType: 'application/pdf',
      Icon: PdfIcon,
      Previewer: Previewer.Pdf,
    },
    ...['application/rtf', 'text/rtf'].map((mimeType) => ({
      mimeType,
      Icon: DocumentIcon,
      Previewer: Previewer.Rtf,
    })),
    ...[
      'application/vnd.ms-excel',
      'application/vnd.ms-excel.sheet.macroenabled.12',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      'application/vnd.ms-excel.sheet.binary.macroenabled.12',
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ].map((mimeType) => ({
      mimeType,
      Icon: SpreadsheetIcon,
      Previewer: Previewer.Excel,
    })),
    {
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      Icon: DocumentIcon,
      Previewer: Previewer.Word,
    },
    {
      mimeType: 'text/css',
      Icon: OtherIcon,
      Previewer: Previewer.PlainText,
    },
    {
      mimeType: 'text/csv',
      Icon: SpreadsheetIcon,
      Previewer: Previewer.Csv,
    },
    {
      mimeType: 'text/html',
      Icon: DocumentIcon,
      Previewer: Previewer.Html,
    },
    {
      mimeType: 'text/plain',
      Icon: DocumentIcon,
      Previewer: Previewer.PlainText,
    },
    ...[
      'audio/3gpp',
      'audio/3gpp2',
      'audio/aac',
      'audio/adpcm',
      'audio/basic',
      'audio/m4a',
      'audio/midi',
      'audio/midi',
      'audio/mp4',
      'audio/mpeg',
      'audio/ogg',
      'audio/opus',
      'audio/vnd.rip',
      'audio/wav',
      'audio/webm',
      'audio/x-aac',
      'audio/x-aiff',
      'audio/x-caf',
      'audio/x-flac',
      'audio/x-m4a',
      'audio/x-matroska',
      'audio/x-midi',
      'audio/x-mpegurl',
      'audio/x-ms-wax',
      'audio/x-ms-wma',
      'audio/x-pn-realaudio',
      'audio/x-wav',
      'audio/xm',
    ].map((mimeType) => ({
      mimeType,
      Icon: AudioIcon,
      Previewer: Previewer.Native,
    })),
    ...[
      'application/vnd.oasis.opendocument.graphics',
      'application/vnd.oasis.opendocument.graphics-template',
      'application/vnd.oasis.opendocument.image',
      'application/vnd.oasis.opendocument.image-template',
      'image/bmp',
      'image/cgm',
      'image/g3fax',
      'image/gif',
      'image/ief',
      'image/jpe',
      'image/jpeg',
      'image/jpg',
      'image/ktx',
      'image/png',
      'image/sgi',
      'image/svg+xml',
      'image/tiff',
      'image/vnd.adobe.photoshop',
      'image/webp',
      'image/x-cmu-raster',
      'image/x-cmx',
      'image/x-freehand',
      'image/x-icon',
      'image/x-mrsid-image',
      'image/x-pcx',
      'image/x-pict',
      'image/x-portable-anymap',
      'image/x-portable-bitmap',
      'image/x-portable-graymap',
      'image/x-portable-pixmap',
      'image/x-rgb',
      'image/x-tga',
      'image/x-xbitmap',
      'image/x-xpixmap',
    ].map((mimeType) => ({
      mimeType,
      Icon: ImageIcon,
      Previewer: Previewer.Native,
    })),
    ...[
      'video/3gpp',
      'video/3gpp2',
      'video/h261',
      'video/h263',
      'video/h264',
      'video/jpeg',
      'video/jpm',
      'video/mj2',
      'video/mp2t',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/quicktime',
      'video/vnd.mpegurl',
      'video/vnd.vivo',
      'video/webm',
      'video/x-f4v',
      'video/x-fli',
      'video/x-flv',
      'video/x-m4v',
      'video/x-matroska',
      'video/x-mng',
      'video/x-ms-asf',
      'video/x-ms-vob',
      'video/x-ms-wm',
      'video/x-ms-wmv',
      'video/x-ms-wmx',
      'video/x-ms-wvx',
      'video/x-msvideo',
      'video/x-sgi-movie',
      'video/x-smv',
    ].map((mimeType) => ({
      mimeType,
      Icon: VideoIcon,
      Previewer: Previewer.Native,
    })),
    ...[
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.spreadsheet-template',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    ].map((mimeType) => ({
      mimeType,
      Icon: SpreadsheetIcon,
    })),
    ...[
      'application/msword',
      'application/postscript',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.text-master',
      'application/vnd.oasis.opendocument.text-template',
      'application/vnd.oasis.opendocument.text-web',
      'application/vnd.visio',
      'application/vnd.wordperfect',
      'application/x-font-ghostscript',
      'application/x-ms-wmd',
      'application/x-mswrite',
      'application/x-tex',
      'openxmlformats-officedocument.wordprocessingml.template',
      'text/richtext',
      'text/sgml',
    ].map((mimeType) => ({
      mimeType,
      Icon: DocumentIcon,
    })),
  ],
  (x) => x.mimeType
).asMap;
