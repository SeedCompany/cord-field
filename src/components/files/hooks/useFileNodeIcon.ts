import {
  Description as DescriptionIcon,
  Folder as FolderIcon,
  GraphicEq as GraphicEqIcon,
  Image as ImageIcon,
  InsertDriveFile as InsertDriveFileIcon,
  SvgIconComponent,
  TableChart as TableChartIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@material-ui/icons';
import { FileNode, FileNodeCategory } from '../../../api';

const icons: Partial<Record<FileNodeCategory, SvgIconComponent>> = {
  Audio: GraphicEqIcon,
  Directory: FolderIcon,
  Document: DescriptionIcon,
  Image: ImageIcon,
  Other: InsertDriveFileIcon,
  Spreadsheet: TableChartIcon,
  Video: VideoLibraryIcon,
};

export const useFileNodeIcon = (): ((
  category: FileNode['category']
) => SvgIconComponent) => {
  const fileIcon = (category: FileNode['category']) => {
    const Icon = icons[category] ?? InsertDriveFileIcon;
    return Icon;
  };
  return fileIcon;
};
