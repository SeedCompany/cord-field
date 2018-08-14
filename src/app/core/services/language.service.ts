import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Language } from '../models/language';
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
}
