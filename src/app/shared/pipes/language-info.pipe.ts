import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../core/models/language';

@Pipe({
  name: 'languageInfo',
})
export class LanguageInfoPipe implements PipeTransform {

  constructor(private numberPipe: DecimalPipe) {
  }

  transform(language: Language, args?: any): string {
    const info = [];
    if (language.ethnologueCode) {
      info.push('Ethnologue: ' + language.ethnologueCode);
    }
    if (language.rodNumber) {
      info.push('ROD: ' + language.rodNumber);
    }
    if (language.population) {
      info.push('Population: ' + this.numberPipe.transform(language.population.toString()));
    }

    return info.join(' | ');
  }
}
