import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization } from '../models/organization';

@Injectable()
export class OrganizationService {

  private organizations: Organization[];

  constructor(private http: HttpClient) {
  }

  async search(term: string): Promise<Organization[]> {
    if (!this.organizations) {
      this.organizations = await this.http
        .get<Organization[]>('https://api.mockaroo.com/api/47c0bce0?count=1000&key=fe2eb390')
        .map(list => list.map(Organization.fromJson))
        .toPromise();
    }

    const filter = (org: Organization) => org.name.toLowerCase().includes(term.toLowerCase());

    return this.organizations.filter(filter);
  }
}
