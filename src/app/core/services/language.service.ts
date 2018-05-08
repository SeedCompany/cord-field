import { Injectable } from '@angular/core';
import { Language } from '../models/language';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class LanguageService {

  constructor(private ploApi: PloApiService) {
  }

  search(term: string): Promise<Language[]> {
    return this.ploApi
      .get<Language[]>(`/languages/suggestions?term=${term}`)
      .map(languages => languages.map(Language.fromJson))
      .toPromise();
  }
}
