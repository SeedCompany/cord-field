import {
  FileNodeInfo_Directory_Fragment as Directory,
  FileNodeInfo_File_Fragment,
} from '../../../components/files/files.generated';
import { isTypename } from '../../../util';

export type FileOrDirectory = Directory | FileNodeInfo_File_Fragment;

export const isDirectory = isTypename<Directory>('Directory');

export const DndFileNode = 'FileNode';

export interface DropOnDirResult {
  id: string;
  name: string;
  down: boolean;
}
