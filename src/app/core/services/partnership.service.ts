import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Partnership } from '../models/partnership';

@Injectable()
export class PartnershipService {

  partnerships: Partnership[] = [
    {
      id: '1',
      name: 'partnership-1'
    },
    {
      id: '2',
      name: 'partnership-2'
    },
    {
      id: '3',
      name: 'partnership-3'
    }, {
      id: '4',
      name: 'partnership-4'
    }
  ];

  search(term: string): Observable<Partnership[]> {
    const filter = (partnership: Partnership) => partnership.name.toLowerCase().includes(term.toLowerCase());

    return Observable.of(this.partnerships.filter(filter));
  }

  getPartnerships(): Observable<Partnership[]> {
    return Observable.of(this.partnerships);
  }

}
