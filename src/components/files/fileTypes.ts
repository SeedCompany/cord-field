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

export interface FileType {
  mimeType: string;
  Icon: SvgIconComponent;
  previewSupported: boolean;
}

export const fileTypes: FileType[] = [
  {
    // Fake type just to handle icons for folders
    mimeType: 'directory',
    Icon: FolderIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.ms-outlook',
    Icon: EmailIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/msword',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/octet-stream',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/pdf',
    Icon: PdfIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/postscript',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/rtf',
    Icon: DocumentIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.ms-excel',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.ms-excel.sheet.macroenabled.12',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.ms-outlook',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.ms-powerpoint',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.ms-project',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.chart',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.chart-template',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.database',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.graphics',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.graphics-template',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.image',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.image',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.image-template',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.presentation',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.presentation-template',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet',
    Icon: SpreadsheetIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet-template',
    Icon: SpreadsheetIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.text',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.text-master',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.text-template',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.oasis.opendocument.text-web',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.slide',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.template',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    Icon: SpreadsheetIcon,
    previewSupported: false,
  },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    Icon: DocumentIcon,
    previewSupported: true,
  },
  {
    mimeType: 'application/vnd.visio',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.visio',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/vnd.wordperfect',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-font-ghostscript',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-font-linux-psf',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-font-pcf',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-font-snf',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-font-type1',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-gtar',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-iso9660-image',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-ms-wmd',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-msaccess',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-mspublisher',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-mswrite',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-tar',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-tex',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-tex-tfm',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/x-texinfo',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'application/zip',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'audio/3gpp',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/3gpp2',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/aac',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/adpcm',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/basic',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/m4a',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/midi',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/midi',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/mp4',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/mpeg',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/ogg',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/opus',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/vnd.rip',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/wav',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/webm',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-aac',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-aiff',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-caf',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-flac',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-m4a',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-matroska',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-midi',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-mpegurl',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-ms-wax',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-ms-wma',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-pn-realaudio',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/x-wav',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'audio/xm',
    Icon: AudioIcon,
    previewSupported: true,
  },
  {
    mimeType: 'font/otf',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'font/ttf',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'font/woff',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'font/woff2',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'image/bmp',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/cgm',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/g3fax',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/gif',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/ief',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/jpe',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/jpeg',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/jpg',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/ktx',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/png',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/sgi',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/svg+xml',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/tiff',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/vnd.adobe.photoshop',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/vnd.dwg',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'image/vnd.dxf',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'image/webp',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-3ds',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'image/x-cmu-raster',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-cmx',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-freehand',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-icon',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-mrsid-image',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-pcx',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-pict',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-portable-anymap',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-portable-bitmap',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-portable-graymap',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-portable-pixmap',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-rgb',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-tga',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-xbitmap',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-xpixmap',
    Icon: ImageIcon,
    previewSupported: true,
  },
  {
    mimeType: 'image/x-xwindowdump',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'openxmlformats-officedocument.wordprocessingml.template',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'text/calendar',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'text/css',
    Icon: OtherIcon,
    previewSupported: true,
  },
  {
    mimeType: 'text/csv',
    Icon: SpreadsheetIcon,
    previewSupported: true,
  },
  {
    mimeType: 'text/html',
    Icon: DocumentIcon,
    previewSupported: true,
  },
  {
    mimeType: 'text/plain',
    Icon: DocumentIcon,
    previewSupported: true,
  },
  {
    mimeType: 'text/rtf',
    Icon: DocumentIcon,
    previewSupported: true,
  },
  {
    mimeType: 'text/richtext',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'text/sgml',
    Icon: DocumentIcon,
    previewSupported: false,
  },
  {
    mimeType: 'text/tab-separated-values',
    Icon: OtherIcon,
    previewSupported: false,
  },
  {
    mimeType: 'video/3gpp',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/3gpp2',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/h261',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/h263',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/h264',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/jpeg',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/jpm',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/mj2',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/mp2t',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/mp4',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/mpeg',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/ogg',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/quicktime',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/vnd.mpegurl',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/vnd.vivo',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/webm',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-f4v',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-fli',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-flv',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-m4v',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-matroska',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-mng',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-ms-asf',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-ms-vob',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-ms-wm',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-ms-wmv',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-ms-wmx',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-ms-wvx',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-msvideo',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-sgi-movie',
    Icon: VideoIcon,
    previewSupported: true,
  },
  {
    mimeType: 'video/x-smv',
    Icon: VideoIcon,
    previewSupported: true,
  },
];

const previewableTypes = fileTypes.filter((type) => type.previewSupported);

export type PreviewableMimeType = (typeof previewableTypes)[number]['mimeType'];

export const previewableImageTypes = previewableTypes.filter(
  (type) => type.Icon === ImageIcon && type.previewSupported
);
export const previewableAudioTypes = previewableTypes.filter(
  (type) => type.Icon === AudioIcon && type.previewSupported
);
export const previewableVideoTypes = previewableTypes.filter(
  (type) => type.Icon === VideoIcon && type.previewSupported
);

export const fileIcon = (mimeType: string) => {
  return (
    fileTypes.find((type) => type.mimeType === mimeType)?.Icon ?? OtherIcon
  );
};
