import {
  GraphicEq as AudioIcon,
  Description as DocumentIcon,
  Folder as FolderIcon,
  InsertDriveFile as GenericFileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  TableChart as SpreadsheetIcon,
  SvgIconComponent,
  VideoLibrary as VideoLibraryIcon,
} from '@material-ui/icons';
import { File } from '../../../api';
import {
  AUDIO_TYPES,
  IMAGE_TYPES,
  SupportedType,
  VIDEO_TYPES,
} from '../FILE_MIME_TYPES';

const audioIcons = AUDIO_TYPES.reduce(
  (icons, type) => ({
    ...icons,
    [type]: AudioIcon,
  }),
  {}
);
const imageIcons = IMAGE_TYPES.reduce(
  (icons, type) => ({
    ...icons,
    [type]: ImageIcon,
  }),
  {}
);
const videoIcons = VIDEO_TYPES.reduce(
  (icons, type) => ({
    ...icons,
    [type]: VideoLibraryIcon,
  }),
  {}
);

const icons: { [key in SupportedType]?: SvgIconComponent } = {
  directory: FolderIcon,
  'application/pdf': PdfIcon,
  'application/vnd.ms-excel': SpreadsheetIcon,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': SpreadsheetIcon,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocumentIcon,
  'text/csv': SpreadsheetIcon,
  ...audioIcons,
  ...imageIcons,
  ...videoIcons,
};

export const useFileNodeIcon = (): ((
  type: File['mimeType'] | 'directory'
) => SvgIconComponent) => {
  const fileIcon = (type: File['mimeType']) => {
    const Icon = icons[type] ?? GenericFileIcon;
    return Icon;
  };
  return fileIcon;
};
