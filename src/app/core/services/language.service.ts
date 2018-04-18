import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Language } from '../models/language';

@Injectable()
export class LanguageService {

  languages: Language[] = [
    {
      id: 'one',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'French'
    },
    {
      id: 'two',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'German'
    },
    {
      id: 'three',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'Italian'
    },
    {
      id: 'four',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'Telugu'
    },
    {
      id: 'five',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'Tamil'
    },
    {
      id: 'six',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'Bengali'
    },
    {
      id: 'seven',
      beginFiscalYear: 1,
      ethnologueCode: 'code',
      ethnologueName: 'ecode',
      ethnologuePopulation: 1000,
      organizationPopulation: 1000,
      rodNumber: 20,
      name: 'Punjabi'
    }
  ];

  search(term: string): Observable<Language[]> {
    const filter = language => language.name.toLowerCase().includes(term.toLowerCase());

    return Observable.of(this.languages.filter(filter));
  }
}
