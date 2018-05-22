import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class LocationService {

  constructor(private ploApi: PloApiService) {
  }

  search(term: string): Promise<Location[]> {
    return this.ploApi
      .get<Location[]>('/locations/suggestions', {params: {term}})
      .map(list => list.map(Location.fromJson))
      .toPromise();
  }
}
