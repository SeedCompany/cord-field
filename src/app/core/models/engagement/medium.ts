import { buildEnum } from '@app/core/models/enum';

export enum ProjectMedium {
  Audio = 'audio',
  App = 'app',
  EBook = 'ebook',
  Print = 'print',
  Web = 'web',
  Video = 'video'
}

export namespace ProjectMedium {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectMedium, {
    [ProjectMedium.Audio]: 'Audio',
    [ProjectMedium.App]: 'App',
    [ProjectMedium.EBook]: 'E-Book',
    [ProjectMedium.Print]: 'Print',
    [ProjectMedium.Web]: 'Web',
    [ProjectMedium.Video]: 'Video'
  });
}
