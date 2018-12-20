import { Injectable } from '@angular/core';
import { Organization } from '../models/organization';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {

  constructor(private plo: PloApiService) {
  }

  search(term: string): Promise<Organization[]> {
    return this.plo.get<Organization[]>('/organizations/suggestions', {params: {term}}).toPromise();
  }
}
