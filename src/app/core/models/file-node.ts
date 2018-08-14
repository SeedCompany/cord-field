import { DateTime } from 'luxon';
import { buildEnum } from './enum';
import { User } from './user';

export class FileNode {
  id: string;
  type: FileNodeType;
  name: string;
  createdAt: DateTime;
  modifiedAt: DateTime | null;
  owner: User;
  size: number | null;

  static fromJson(json: any): FileNode {
    json = json || {};

    const file = new FileNode();

    file.id = json.id;
    file.createdAt = DateTime.fromISO(json.createdAt);
    file.modifiedAt = json.modifiedAt ? DateTime.fromISO(json.modifiedAt) : null;
    file.name = json.name;
    file.type = json.type;
    file.owner = User.fromJson(json.owner);
    file.size = file.type === FileNodeType.Directory ? null : json.size || 0;

    return file;
  }

  static fromJsonArray(files: any): FileNode[] {
    files = files || [];
    return files.map(FileNode.fromJson);
  }
}

export enum FileNodeType {
  Directory = 'd',
  File = 'f'
}

export interface FileList {
  files: FileNode[];
  total: number;
}

export namespace FileNodeType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<FileNodeType>(FileNodeType, {
    [FileNodeType.Directory]: 'Directory',
    [FileNodeType.File]: 'File'
  });
}

