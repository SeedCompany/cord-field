import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Location } from '../../../core/models/location';
import { LocationService } from '../../../core/services/location.service';
import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-autocomplete-location',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteLocationComponent extends AutocompleteComponent<Location> {

  @Input() placeholder = 'Locations';
  @Input() requiredMessage = 'Please enter a location';
  @Input() serverErrorMessage = 'Failed to fetch locations';
  @Input() displayItem = (loc: Location) => `${loc.country} | ${loc.area.name} | ${loc.area.region.name}`;
  @Input() trackBy = (location: Location) => location.id;
  @Input() fetcher = (term: string) => this.locationService.search(term);

  constructor(private locationService: LocationService, snackBar: MatSnackBar) {
    super(snackBar);
  }
}
