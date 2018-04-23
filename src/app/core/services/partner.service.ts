import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Partner } from '../models/partner';

@Injectable()
export class PartnerService {

  partners: Partner[] = [
    {
      id: '1',
      name: 'partner-1'
    },
    {
      id: '2',
      name: 'partner-2'
    },
    {
      id: '3',
      name: 'partner-3'
    }, {
      id: '4',
      name: 'partner-4'
    }
  ];

  search(term: string): Observable<Partner[]> {
    const filter = partner => partner.name.toLowerCase().includes(term.toLowerCase());

    return Observable.of(this.partners.filter(filter));
  }

  getPartners(): Observable<Partner[]> {
    return Observable.of(this.partners);
  }

}
