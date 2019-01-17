import { Injectable } from '@angular/core';
import { ifValue } from '@app/core/util';
import { listApi } from '@app/core/util/list-views';
import { map } from 'rxjs/operators';
import { Language, LanguageListFilter, LanguageListItem } from '../models/language';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root',
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

  // tslint:disable-next-line:member-ordering
  getLanguages = listApi(
    this.ploApi,
    '/languages',
    LanguageListItem.fromJson,
    (filter: LanguageListFilter) => ({
      locationId: ifValue(filter.location, locs => locs.map(l => l.id)),
    }),
  );
}
