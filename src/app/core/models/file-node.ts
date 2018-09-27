import { DateTime } from 'luxon';
import { buildEnum } from './enum';
import { User } from './user';

export type FileNode = File | Directory;

// Type is split so WebStorm still autocompletes the key values
// It autocompletes the exclusion as well, but tsc catches that.
type Keys = keyof File | keyof Directory;
export type FileKeys = Exclude<Keys, 'isFile' | 'isDir'>;

class BaseNode {
  id: string;
  projectId: string;
  type: FileNodeType;
  name: string;
  createdAt: DateTime | null;
  owner: User;
  parents: ParentRef[];

  isFile(): this is File {
    return this.type === FileNodeType.File;
  }
  isDir(): this is Directory {
    return this.type === FileNodeType.Directory;
  }
}

export class File extends BaseNode {
  type: FileNodeType.File;
  modifiedAt: DateTime | null;
  size: number;
}

export class Directory extends BaseNode {
  type: FileNodeType.Directory;
  children: FileNode[];
}

export function fromJson(json: any): FileNode {
  let node;
  if (json.type === FileNodeType.Directory) {
    node = new Directory();
    node.children = ((json.children || []) as FileNode[]).map(child => fromJson({...child, projectId: json.projectId}));
  } else if (json.type === FileNodeType.File) {
    node = new File();
    node.modifiedAt = json.modifiedAt ? DateTime.fromISO(json.modifiedAt) : null;
    node.size = json.size || 0;
  } else {
    throw new Error('Unknown File Type');
  }

  node.id = json.id;
  node.projectId = json.projectId;
  node.createdAt = json.createdAt ? DateTime.fromISO(json.createdAt) : null;
  node.name = json.name;
  node.type = json.type;
  node.owner = User.fromJson(json.owner || {});
  node.parents = json.parents;

  return node;
}

export interface ParentRef {
  id: string;
  name: string;
}

export enum FileNodeType {
  Directory = 'dir',
  File = 'file'
}

export namespace FileNodeType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<FileNodeType>(FileNodeType, {
    [FileNodeType.Directory]: 'Directory',
    [FileNodeType.File]: 'File'
  });
}
