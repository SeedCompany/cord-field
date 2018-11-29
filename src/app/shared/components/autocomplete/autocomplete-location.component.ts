import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { Location } from '@app/core/models/location';
import { LocationService } from '@app/core/services/location.service';

import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-autocomplete-location',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    ValueAccessorProvider(AutocompleteLocationComponent),
  ],
})
export class AutocompleteLocationComponent extends AutocompleteComponent<Location> {

  @Input() placeholder = 'Locations';
  @Input() requiredMessage = 'Please enter a location';
  @Input() serverErrorMessage = 'Failed to fetch locations';
  @Input() displayItem = (loc: Location) => loc.displayName;
  @Input() trackBy = (loc: Location) => loc.displayName;
  @Input() fetcher = (term: string) => this.locationService.search(term);

  constructor(
    private locationService: LocationService,
    snackBar: MatSnackBar,
  ) {
    super(snackBar);
  }
}
