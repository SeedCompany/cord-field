import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { Location } from '../../core/models/location';

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss']
})
export class ProjectLocationTimeframeComponent implements OnInit {
  form: FormGroup;
  locationCtrl: FormControl;
  locationList = [];
  locSelected;
  locations = [
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
        name: 'jublee hills'
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
        name: 'jublee hills'
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
        name: 'jublee hills'
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
    this.locationCtrl = new FormControl();
    this.locationCtrl.valueChanges
      .pipe(
        startWith(''),
        map(area => area ? this.filterAreas(area) : this.locations.slice())
      ).subscribe(data => this.locationList = data);
  }

  trackLocationsById(index: number, location: Location): string {
    return location.id;
  }

  filterAreas(area: string): Location[] {
    return this.locations.filter(location =>
      location.area.name.toLowerCase().indexOf(area.toLowerCase()) === 0);
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.locSelected = event.option.value;
  }

  onLocationBlur(): void {
    if (this.locationCtrl.value) {
      if (!this.validateArea(this.locationCtrl.value)) {
        this.locationCtrl.setValue('');
      }
    }
  }

  validateArea(area: string): boolean {
    const locations = this.locations.filter(location =>
      location.area.name.toLowerCase() === area.toLowerCase());
    return locations.length !== 0;
  }
}
