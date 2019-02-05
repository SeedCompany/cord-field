import { buildEnum } from '@app/core/models/enum';

export enum FileNodeType {
  Directory = 'dir',
  File = 'file',
}

export namespace FileNodeType {
  const Enum = FileNodeType;
  export const {entries, forUI, values, length, trackEntryBy, trackValueBy} = buildEnum<FileNodeType>(Enum, {
    [Enum.Directory]: 'Directory',
    [Enum.File]: 'File',
  });
}
