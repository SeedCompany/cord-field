import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { Language } from '../../../core/models/language';
import { Location } from '../../../core/models/location';
import { getProjectStages, ProjectSensitivities, ProjectStatus, projectTypeList } from '../../../core/models/project';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss']
})
export class ProjectListFilterComponent implements OnInit {

  minDate: Date;
  form: FormGroup;
  readonly getProjectStages = getProjectStages;
  readonly ProjectStatus = ProjectStatus;
  readonly projectTypeList = projectTypeList;
  readonly projectSensitivities = ProjectSensitivities;
  locationList: Location[] = [];
  locSelected: Location | null;
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
  selectedLanguages: string[] = [];
  languagesData: Language[];
  filteredLanguages: Observable<any[]>;
  separatorKeysCodes = [ENTER, COMMA];
  @ViewChild('chipInput') chipInput: ElementRef;

  constructor(private formBuilder: FormBuilder, private languageService: LanguageService) {
  }


  get location(): AbstractControl {
    return this.form.get('location')!;
  }

  get language(): AbstractControl {
    return this.form.get('language')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('startDate')!;
  }

  ngOnInit() {
    this.languagesData = this.languageService.languages;
    this.form = this.formBuilder.group({
      stage: [''],
      type: [''],
      language: [''],
      sensitivity: [''],
      dateRange: [''],
      startDate: [''],
      endDate: [''],
      location: ['']
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
    this.filteredLanguages = this.language.valueChanges
      .pipe(
        startWith(''),
        map(input => input ? this.filterLanguages(input.toString()) : this.languagesData.slice())
      );
    this.form.valueChanges.subscribe(val => {
    });
  }

  trackLocationsById(index: number, location: Location): string {
    return location.id;
  }
  trackLanguageById(index: number, language: Location): string {
    return language.id;
  }

  trackProjectStatus(index: number): number {
    return index;
  }

  trackByIndex(index: number): number {
    return index;
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

  filterLanguages(language: string) {
    return this.languagesData
      .filter(item => item.name.toLowerCase().indexOf(language.toLowerCase()) === 0);
  }


  onRemoveLanguage(itemName: string): void {
    this.selectedLanguages = this.selectedLanguages.filter((name: string) => name !== itemName);
  }

  onAddLanguage(event: MatAutocompleteSelectedEvent) {
    const language: Language = event.option.value;
    if (this.selectedLanguages.length === 0) {
      this.selectedLanguages.push(language.name);
    } else {
      const selectLanguageStr = JSON.stringify(this.selectedLanguages);
      if (selectLanguageStr.indexOf(language.name) === -1) {
        this.selectedLanguages.push(language.name);
      }
    }
    this.chipInput.nativeElement.value = '';
    this.language.setValue(this.selectedLanguages);
  }
}
