import { buildEnum } from '@app/core/models/enum';

export enum FileNodeCategory {
  Audio = 'audio',
  Directory = 'directory',
  Document = 'doc',
  Image = 'image',
  Other = 'other',
  Spreadsheet = 'spreadsheet',
  Video = 'video',
}

export namespace FileNodeCategory {
  const Enum = FileNodeCategory;
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<FileNodeCategory>(Enum, {
    [Enum.Audio]: 'Audio',
    [Enum.Directory]: 'Directory',
    [Enum.Document]: 'Document',
    [Enum.Image]: 'Image',
    [Enum.Other]: 'Other',
    [Enum.Spreadsheet]: 'Spreadsheet',
    [Enum.Video]: 'Video',
  });
}
