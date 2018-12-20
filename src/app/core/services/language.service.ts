import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { HttpParams } from '@app/core/services/http/abstract-http-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Language, LanguageListFilter, LanguageListItem, LanguagesWithTotal } from '../models/language';
import { PloApiService } from './http/plo-api.service';

export interface LanguageFilterAPI {
  locationId?: string[];
}

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

  getLanguages(
    sort: keyof LanguageListItem = 'displayName',
    order: SortDirection = 'desc',
    skip = 0,
    limit = 10,
    filter?: LanguageListFilter,
    fields?: Array<keyof LanguageListItem>,
  ): Observable<LanguagesWithTotal> {
    const params: HttpParams = {
      sort,
      skip: skip.toString(),
      limit: limit.toString(),
      order,
    };

    if (filter) {
      const filterAPI = this.buildFilter(filter);
      params.filter = JSON.stringify(filterAPI);
    }

    if (fields) {
      params.fields = fields;
    }

    return this
      .ploApi
      .get<LanguageListItem[]>('/languages', {params, observe: 'response'})
      .pipe(map((response: HttpResponse<LanguageListItem[]>) => {
        return {
          languages: (response.body || []).map(LanguageListItem.fromJson),
          total: Number(response.headers.get('x-sc-total-count')) || 0,
        };
      }));
  }

  private buildFilter(filter: LanguageListFilter): LanguageFilterAPI {

    const locationId = filter.location ? filter.location.map(l => l.id) : undefined;

    return {locationId};
  }
}
