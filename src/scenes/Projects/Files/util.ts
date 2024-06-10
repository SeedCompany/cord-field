import { isTypename } from '~/common';
import {
  FileNodeInfo_Directory_Fragment as Directory,
  FileNodeInfo_File_Fragment,
} from '../../../components/files/files.graphql';

export type { Directory };

export type FileRowData = FileOrDirectory & { parent: Directory };

export type FileOrDirectory = Directory | FileNodeInfo_File_Fragment;

export const isDirectory = isTypename<Directory>('Directory');

export const DndFileNode = 'FileNode';

export interface DropOnDirResult {
  id: string;
  name: string;
  down: boolean;
}
