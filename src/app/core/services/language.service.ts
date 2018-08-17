import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Language, LanguageListItem, LanguagesWithTotal } from '../models/language';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private ploApi: PloApiService) {
  }

  search(term: string): Promise<Language[]> {
    return this.ploApi
      .get<Language[]>('/languages/suggestions', {params: {term}})
      .pipe(map(languages => languages.map(Language.fromJson)))
      .toPromise();
  }

  getLanguages(sort: keyof LanguageListItem = 'updatedAt',
               order: SortDirection = 'desc',
               skip = 0,
               limit = 10,
               fields?: Array<keyof LanguageListItem>): Observable<LanguagesWithTotal> {

    const languages = [
      {
        'location': {'country': 'Americas'},
        'ethnologueCode': 'tdx',
        'name': 'Tandroy',
        'displayName': 'Tandroy',
        'currentProjects': 10
      },
      {
        'location': {'country': 'Eurasia'},
        'ethnologueCode': 'gax',
        'name': 'Guji',
        'displayName': 'Guji',
        'currentProjects': 1
      },
      {

        'location': {'country': 'Mainland Asia'},
        'ethnologueCode': 'gax',
        'name': 'Borana',
        'displayName': 'Borana',
        'currentProjects': 11
      },
      {
        'location': {'country': 'Anglophone Africa East'},
        'ethnologueCode': 'msh',
        'name': 'Masikoro',
        'displayName': 'Masikoro',
        'currentProjects': 17
      },
      {
        'location': {'country': 'South Asia'},
        'ethnologueCode': null,
        'name': 'Yeshil',
        'displayName': 'Yeshil'
      },
      {
        'location': {'country': 'Sahel Africa'},
        'ethnologueCode': 'guf',
        'name': 'Gupapuynu',
        'displayName': 'Gupapuyngu'
      },
      {
        'location': {'country': 'Southern Africa'},
        'ethnologueCode': 'sfa',
        'name': 'Trawler',
        'displayName': 'Trawler'
      },
      {
        'location': {'country': 'Pacific'},
        'ethnologueCode': null,
        'name': 'Goa',
        'displayName': 'Goa'
      },
      {
        'location': {'country': 'Islands Asia'},
        'ethnologueCode': null,
        'name': 'Alqadima',
        'displayName': 'Alqadima'
      },
      {
        'location': {'country': 'Americas'},
        'ethnologueCode': 'ags',
        'name': 'Esimbi',
        'displayName': 'Esimbi'
      }];

    const data = {
      languages: LanguageListItem.fromJsonArray(languages),
      total: languages.length || 0
    };
    return observableOf(data);
  }
}
