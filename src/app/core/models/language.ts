import { maybeRedacted } from './util';

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
}
