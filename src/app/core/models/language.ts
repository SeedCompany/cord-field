export class Language {

  id: string;
  beginFiscalYear: number;
  ethnologueCode: string;
  ethnologueName: string;
  ethnologuePopulation: number;
  organizationPopulation: number;
  rodNumber: number;
  name: string;

  static fromJson(json: any): Language {

    const language = new Language();

    language.id = json.id || '';
    language.beginFiscalYear = json.beginFiscalYear || 0;
    language.ethnologueCode = json.ethnologueCode || '';
    language.ethnologueName = json.ethnologueName || '';
    language.ethnologuePopulation = json.ethnologuePopulation || 0;
    language.organizationPopulation = json.organizationPopulation || 0;
    language.rodNumber = json.rodNumber || 0;
    language.name = json.name || '';

    return language;
  }
}
