import { buildEnum } from '@app/core/models/enum';

export enum ProjectProduct {
  AGospel = 'gospel',
  BibleStories = 'bibstories',
  FullBible = 'fullbible',
  Genesis = 'genesis',
  JesusFilm = 'jesusfilm',
  LiteracyMaterials = 'litmaterials',
  Songs = 'songs',
  NewTestamentFull = 'ntfull',
  NewTestamentPortions = 'ntportions',
  OldTestamentFull = 'otfull',
  OldTestamentPortions = 'otportions'
}

export namespace ProjectProduct {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectProduct, {
    [ProjectProduct.AGospel]: 'A Gospel',
    [ProjectProduct.BibleStories]: 'Bible Stories',
    [ProjectProduct.FullBible]: 'Full Bible',
    [ProjectProduct.Genesis]: 'Genesis',
    [ProjectProduct.JesusFilm]: 'Jesus Film',
    [ProjectProduct.LiteracyMaterials]: 'Literacy Materials',
    [ProjectProduct.Songs]: 'Songs',
    [ProjectProduct.NewTestamentFull]: 'New Testament Full',
    [ProjectProduct.NewTestamentPortions]: 'New Testament Portions',
    [ProjectProduct.OldTestamentFull]: 'Old Testament - Full',
    [ProjectProduct.OldTestamentPortions]: 'Old Testament - Portions'
  });
}
