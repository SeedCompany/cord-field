import { REDACTED } from './util';

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
    language.name = json.name && json.name !== REDACTED ? json.name : null;
    language.displayName = json.displayName;
    language.beginFiscalYear = json.beginFiscalYear;
    language.ethnologueCode = json.ethnologueCode || null;
    language.ethnologueName = json.ethnologueName || null;
    language.ethnologuePopulation = json.ethnologuePopulation || null;
    language.organizationPopulation = json.organizationPopulation || null;
    language.rodNumber = json.rodNumber || null;

    return language;
  }

  get nameOrDisplayName(): string {
    return this.name || this.displayName;
  }
}
