import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { MatAutocompleteSelectedEvent, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Location } from '../../core/models/location';
import { LocationService } from '../../core/services/location.service';

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss']
})
export class ProjectLocationTimeframeComponent implements OnInit {
  form: FormGroup;
  minDate: Date;
  locationList: Location[] = [];
  private locSelected: Location;
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  constructor(private formBuilder: FormBuilder, private locationService: LocationService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.location.valueChanges
      .filter(loc => typeof loc === 'string')
      .startWith('')
      .do(() => {
        this.locSelected = null;
      })
      .map(loc => loc.trim())
      .filter(loc => loc.length > 1)
      .debounceTime(500)
      .distinctUntilChanged()
      .filter(() => !this.location.hasError('required')) // Don't continue if user has already cleared the text
      .do(() => {
        this.location.markAsPending();
        this.locationList.length = 0;
      })
      .switchMap(async (term: string) => {
        try {
          return await this.locationService.search(term);
        } catch (e) {
          return e; // returning error to prevent observable from completing
        }
      })
      .subscribe((locations: Location[] | HttpErrorResponse) => {
        if (this.location.hasError('required')) {
          return;
        }

        if (locations instanceof HttpErrorResponse) {
          this.showSnackBar('Failed to fetch locations');
          return;
        }

        // Be sure first error shows immediately instead of waiting for field to blur
        this.location.markAsTouched();

        (locations.length > 0)
          ? this.locationList = locations
          : this.location.setErrors({noMatches: true});
      });

    this.startDate.valueChanges.subscribe(value => {
      this.minDate = value;
    });
  }

  get location(): AbstractControl {
    return this.form.get('location');
  }

  get startDate(): AbstractControl {
    return this.form.get('startDate');
  }

  trackLocationsById(index: number, location: Location): string {
    return location.id;
  }

  onLocationSelected(event: MatAutocompleteSelectedEvent): void {
    this.locSelected = event.option.value;
  }

  onLocationBlur(): void {
    if (!this.locSelected) {
      this.location.setValue('');
    }
  }

  showLocationName(loc?: Location): string {
    return loc ? `${loc.country} | ${loc.area.name} | ${loc.region.name}` : '';
  }

  private showSnackBar(message: string): void {
    this.snackBarRef = this.snackBar.open(message, null, {
      duration: 3000
    });
  }
}
