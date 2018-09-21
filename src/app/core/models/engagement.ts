import { buildEnum } from '@app/core/models/enum';
import { DateTime } from 'luxon';

export enum ProjectApproach {
  OralStorying = 'os',
  OralTranslation = 'ot',
  Written = 'wt',
  SignLanguage = 'sl'
}

export namespace ProjectApproach {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectApproach, {
    [ProjectApproach.OralStorying]: 'Oral Storying',
    [ProjectApproach.OralTranslation]: 'Oral Translation',
    [ProjectApproach.Written]: 'Written',
    [ProjectApproach.SignLanguage]: 'Sign Language'
  });
}

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

export namespace ProjectEngagement {
  export const approaches = [
    ProjectApproach.OralStorying,
    ProjectApproach.OralTranslation,
    ProjectApproach.SignLanguage,
    ProjectApproach.Written
  ];
  export const products = [
    ProjectProduct.AGospel,
    ProjectProduct.BibleStories,
    ProjectProduct.FullBible,
    ProjectProduct.Genesis,
    ProjectProduct.JesusFilm,
    ProjectProduct.LiteracyMaterials,
    ProjectProduct.NewTestamentFull,
    ProjectProduct.NewTestamentPortions,
    ProjectProduct.OldTestamentFull,
    ProjectProduct.OldTestamentPortions,
    ProjectProduct.Songs
  ];
  export const mediums = [
    ProjectMedium.App,
    ProjectMedium.Audio,
    ProjectMedium.EBook,
    ProjectMedium.Print,
    ProjectMedium.Video,
    ProjectMedium.Web
  ];
}

export class Engagement {
  id: string;
  languageId: string;
  languageName: string;
  products: ProjectProduct[];
  mediums: ProjectMedium[];
  approach: ProjectApproach;
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
  updatedBy: string;
  updatedAt: DateTime | null;

  static fromJson(json: any): Engagement {
    json = json || {};

    const engagement = new Engagement();

    engagement.id = json.id;
    engagement.languageId = json.languageId;
    engagement.languageName = json.languageName;
    engagement.products = json.products || [];
    engagement.mediums = json.mediums || [];
    engagement.approach = json.approach;
    engagement.isLukePartnership = json.isLukePartnership || false;
    engagement.isFirstScripture = json.isFirstScripture || false;
    engagement.isDedicationPlanned = json.isDedicationPlanned || false;
    engagement.dedicationDate = json.dedicationDate ? DateTime.fromISO(json.dedicationDate) : null;
    engagement.updatedBy = json.updatedBy;
    engagement.updatedAt = json.updatedAt ? DateTime.fromISO(json.updatedAt) : null;

    return engagement;
  }

  static fromJsonArray(engagements: any[]): Engagement[] {
    engagements = engagements || [];
    return engagements.map(Engagement.fromJson);
  }
}

export interface ModifiedEngagement {
  products?: ProjectProduct[];
  mediums?: ProjectMedium[];
  approach?: ProjectApproach;
  isLukePartnership?: boolean;
  isFirstScripture?: boolean;
  isDedicationPlanned?: boolean;
  dedicationDate?: DateTime;
}
