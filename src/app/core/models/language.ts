import { Location } from '@app/core/models/location';
import { DateTime } from 'luxon';

import { firstLettersOfWords, maybeRedacted } from '../util';

export class Language {

  id: string;
  name: string | null;
  displayName: string;
  beginFiscalYear: number;
  ethnologueCode: string | null;
  ethnologueName: string | null;
  ethnologuePopulation: number | null;
  organizationPopulation: number | null;
  rodNumber: number | null;

  static fromJson(json: any): Language {
    const language = new Language();

    language.id = json.id;
    language.name = maybeRedacted(json.name);
    language.displayName = json.displayName;
    language.beginFiscalYear = json.beginFiscalYear;
    language.ethnologueCode = maybeRedacted(json.ethnologueCode);
    language.ethnologueName = maybeRedacted(json.ethnologueName);
    language.ethnologuePopulation = maybeRedacted<number>(json.ethnologuePopulation);
    language.organizationPopulation = json.organizationPopulation || null;
    language.rodNumber = maybeRedacted<number>(json.rodNumber);

    return language;
  }

  get nameOrDisplayName(): string {
    return this.name || this.displayName;
  }

  get population(): number | null {
    return this.organizationPopulation || this.ethnologuePopulation;
  }

  get avatarLetters() {
    return firstLettersOfWords(this.nameOrDisplayName);
  }
}

export class LanguageListItem {
  id: string;
  name: string | null;
  displayName: string;
  locations: Location[];
  ethnologueCode: string | null;
  activeProjects: number;
  updatedAt: DateTime;

  static fromJson(json: any): LanguageListItem {
    const language = new LanguageListItem();
    language.id = json.id;
    language.name = maybeRedacted(json.name);
    language.displayName = json.displayName;
    language.ethnologueCode = maybeRedacted(json.ethnologueCode);
    language.locations = (json.locations || []).map(Location.fromJson);
    language.activeProjects = json.activeProjects || 0;

    return language;
  }

  static fromJsonArray(languages: any): LanguageListItem[] {
    languages = languages || [];
    return languages.map(LanguageListItem.fromJson);
  }

  get nameOrDisplayName(): string {
    return this.name || this.displayName;
  }
}

export interface LanguagesWithTotal {
  languages: LanguageListItem[];
  total: number;
}

export interface LanguageListFilter {
  location?: Location[];
}
