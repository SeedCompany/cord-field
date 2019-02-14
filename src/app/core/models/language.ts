import { FieldConfig, mapChangeList, ModifiedList, returnId, returnSelf } from '@app/core/change-engine';
import { Location } from '@app/core/models/location';
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

  static fieldConfigList = (): FieldConfig<Language[], ModifiedLanguages> => ({
    accessor: returnId,
    toServer: mapChangeList(returnId, returnId),
    store: mapChangeList(returnSelf, returnSelf),
    restore: mapChangeList(Language.fromJson, Language.fromJson),
  });

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
  displayName: string;
  locations: Location[];
  ethnologueCode: string | null;
  activeProjects: number;

  static fromJson(json: any): LanguageListItem {
    const language = new LanguageListItem();
    language.id = json.id;
    language.displayName = json.displayName;
    language.ethnologueCode = maybeRedacted(json.ethnologueCode);
    language.locations = (json.locations || []).map(Location.fromJson);
    language.activeProjects = json.activeProjects || 0;

    return language;
  }
}

export interface LanguageListFilter {
  location?: Location[];
}

export type ModifiedLanguages = ModifiedList<string, string, never>;
