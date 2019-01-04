import { buildEnum } from '@app/core/models/enum';

export enum ProductMedium {
  Print = 'print',
  Web = 'web',
  EBook = 'ebook',
  App = 'app',
  Audio = 'audio',
  Video = 'video',
  Other = 'other',
}

export namespace ProductMedium {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProductMedium, {
    [ProductMedium.Audio]: 'Audio Recording',
    [ProductMedium.App]: 'App',
    [ProductMedium.EBook]: 'E-Book',
    [ProductMedium.Print]: 'Print',
    [ProductMedium.Web]: 'Web',
    [ProductMedium.Video]: 'Video',
    [ProductMedium.Other]: 'Other',
  });
}
