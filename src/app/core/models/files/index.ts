import { User } from '@app/core/models/user';
import { clone } from '@app/core/util';
import { DateTime } from 'luxon';
import { FileNodeCategory } from './category';
import { FileNodeType } from './type';
import { UploadFile } from './upload-file';

export { FileNodeCategory, FileNodeType, UploadFile };

export type FileNode = File | Directory;

// Type is split so WebStorm still autocompletes the key values
// It autocompletes the exclusion as well, but tsc catches that.
type Keys = keyof File | keyof Directory;
export type FileKeys = Exclude<Keys, 'isFile' | 'isDir'>;

class BaseNode {
  id: string;
  type: FileNodeType;
  category: FileNodeCategory;
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
  versions: FileVersion[];
}

export class Directory extends BaseNode {
  type: FileNodeType.Directory;
  children: FileNode[];

  /**
   * Return new directory with child node removed.
   */
  withoutChild(child: FileNode) {
    const newDir = clone(this);
    newDir.children = [...this.children.filter(n => n.id !== child.id)];
    return newDir;
  }

  /**
   * Return new directory with child added or replaced.
   */
  withChild(child: FileNode) {
    const newDir = this.withoutChild(child);
    newDir.children.push(child);
    return newDir;
  }
}

export function fromJson<T extends { type: FileNodeType.Directory }>(json: T): Directory;
export function fromJson<T extends { type: FileNodeType.File }>(json: T): File;
export function fromJson<T extends { type: FileNodeType }>(json: T): FileNode;
export function fromJson(json: any): FileNode {
  let node;
  if (json.type === FileNodeType.Directory) {
    node = new Directory();
    node.children = ((json.children || []) as FileNode[]).map(child => fromJson(child));
  } else if (json.type === FileNodeType.File) {
    node = new File();
    node.modifiedAt = json.modifiedAt ? DateTime.fromISO(json.modifiedAt) : null;
    node.size = json.size || 0;
    node.versions = (json.versions || [])
      .filter((v: any) => v)
      .map((version: any) => ({ ...version, createdAt: DateTime.fromISO(version.createdAt) }));
  } else {
    throw new Error('Unknown File Type');
  }

  node.id = json.id;
  node.createdAt = json.createdAt ? DateTime.fromISO(json.createdAt) : null;
  node.name = json.name;
  node.type = json.type;
  node.category = json.category;
  node.owner = User.fromJson(json.owner || {});
  node.parents = json.parents || [];

  return node;
}

export interface ParentRef {
  id: string;
  name: string;
  parentId: string | null;
}

export interface FileVersion {
  id: string;
  eTag: string;
  createdAt: DateTime;
}
