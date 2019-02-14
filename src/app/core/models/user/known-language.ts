import { FieldConfig, mapChangeList, ModifiedList, returnId } from '@app/core/change-engine';
import { Language } from '@app/core/models/language';
import { LanguageProficiency } from './language-proficiency';

export class KnownLanguage {
  language: Language;
  proficiency: LanguageProficiency;

  get id() {
    return this.language.id;
  }

  static fromJson(json: Partial<KnownLanguage>): KnownLanguage {
    const kl = new KnownLanguage();

    kl.language = Language.fromJson(json.language || {});
    kl.proficiency = json.proficiency || LanguageProficiency.Beginner;

    return kl;
  }

  static fieldConfigList = (): FieldConfig<KnownLanguage[], ModifiedKnownLanguages> => ({
    accessor: returnId,
    toServer: mapChangeList(KnownLanguage.forSaveAPI, returnId),
    restore: mapChangeList(KnownLanguage.fromJson, KnownLanguage.fromJson),
  });

  static forSaveAPI(kl: KnownLanguage): KnownLanguageForSaveAPI {
    return {
      languageId: kl.language.id,
      proficiency: kl.proficiency,
    };
  }
}

export type ModifiedKnownLanguages = ModifiedList<KnownLanguageForSaveAPI, string>;

interface KnownLanguageForSaveAPI {
  languageId: string;
  proficiency: LanguageProficiency;
}
