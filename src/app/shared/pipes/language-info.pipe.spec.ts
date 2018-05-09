import { DecimalPipe } from '@angular/common';
import { Language } from '../../core/models/language';
import { LanguageInfoPipe } from './language-info.pipe';

describe('LanguageInfoPipe', () => {

  const pipe = new LanguageInfoPipe(new DecimalPipe('en'));

  it('all info', () => {
    const language = Language.fromJson({
      ethnologueCode: 'code',
      rodNumber: 5000,
      organizationPopulation: 5000
    });
    const expected = 'Ethnologue: code | ROD: 5000 | Population: 5,000';

    expect(pipe.transform(language)).toBe(expected);
  });

  it('no info', () => {
    expect(pipe.transform(Language.fromJson({}))).toBe('');
  });
});
