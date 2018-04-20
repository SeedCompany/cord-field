import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Location } from '../../core/models/location';

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss']
})
export class ProjectLocationTimeframeComponent implements OnInit {
  form: FormGroup;
  minDate;
  locationList = [];
  locSelected;
  locations: Location[] = [
    {
      area: {
        id: 'someid1',
        name: 'jublee hills'
      },
      region: {
        id: 'someid1',
        name: 'hyderabad'
      },
      country: 'india',
      id: '1'
    },
    {
      area: {
        id: 'someid2',
        name: 'lanco hills'
      },
      region: {
        id: 'someid2',
        name: 'hyderabad'
      },
      country: 'india',
      id: '2'
    },
    {
      area: {
        id: 'someid3',
        name: 'hiltop hills'
      },
      region: {
        id: 'someid3',
        name: 'hyderabad'
      },
      country: 'india',
      id: '3'
    },
    {
      area: {
        id: 'someid4',
        name: 'kesava hills'
      },
      region: {
        id: 'someid4',
        name: 'hyderabad'
      },
      country: 'india',
      id: '4'
    }
  ];

  constructor(private formBuilder: FormBuilder) {
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
      .map(loc => loc ? this.filterAreas(loc) : this.locations.slice())
      .subscribe(data => this.locationList = data);

    this.startDate.valueChanges.subscribe(value => {
      this.minDate = value;
    });
  }

  get location() {
    return this.form.get('location');
  }

  get startDate() {
    return this.form.get('startDate');
  }

  trackLocationsById(index: number, location: Location): string {
    return location.id;
  }

  filterAreas(area: string): Location[] {
    return this.locations.filter(location =>
      location.area.name.toLowerCase().indexOf(area.toLowerCase()) === 0);
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

}
