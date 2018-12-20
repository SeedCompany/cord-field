import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Location } from '../models/location';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  constructor(private ploApi: PloApiService) {
  }

  search(term: string): Promise<Location[]> {
    return this.ploApi
      .get<Location[]>('/locations/suggestions', {params: {term}})
      .pipe(map(list => list.map(Location.fromJson)))
      .toPromise();
  }
}
