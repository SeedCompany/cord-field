import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProjectSearchService {
  private _searchCriteria$: Subject<string> = new Subject<string>();

  constructor() {
  }

  get searchCriteria(): Observable<string> {
    return this._searchCriteria$.asObservable();
  }

  sendMessage(query: string) {
    this._searchCriteria$.next(query);
  }

}
