import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../../core/models/language';
import { Location } from '../../../core/models/location';
import {
  ProjectSensitivities,
  ProjectStage,
  projectStagesForStatus,
  projectStageToString,
  ProjectStatus,
  projectTypeList
} from '../../../core/models/project';
import { LanguageService } from '../../../core/services/language.service';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss']
})
export class ProjectListFilterComponent implements OnInit {

  readonly projectStageToString = projectStageToString;
  readonly ProjectStage = ProjectStatus;
  readonly projectStagesForStatus = projectStagesForStatus;
  readonly projectTypeList = projectTypeList;
  readonly projectSensitivities = ProjectSensitivities;

  minDate: Date;
  form: FormGroup = this.formBuilder.group({
    stage: [''],
    type: [''],
    language: [''],
    sensitivity: [''],
    dateRange: [''],
    startDate: [''],
    endDate: [''],
    location: ['']
  });

  selectedLanguages: Language[] = [];
  languagesData: Language[];
  filteredLanguages: Observable<any[]>;

  filteredLocations: Location[] = [];
  selectedLocations: Location[] = [];

  separatorKeysCodes = [ENTER, COMMA];

  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  @ViewChild('chipInput') chipInput: ElementRef;
  @ViewChild('locationChipInput') locationChipInput: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private languageService: LanguageService,
              private locationService: LocationService,
              private snackBar: MatSnackBar) {
  }


  get location(): AbstractControl {
    return this.form.get('location')!;
  }

  get language(): AbstractControl {
    return this.form.get('language')!;
  }

  get dateRange(): AbstractControl {
    return this.form.get('dateRange')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('startDate')!;
  }

  ngOnInit() {
    this.location.valueChanges
      .filter(loc => typeof loc === 'string')
      .startWith('')
      .map(loc => loc.trim())
      .filter(loc => loc.length > 1)
      .debounceTime(500)
      .distinctUntilChanged()
      .do(() => {
        this.filteredLocations.length = 0;
        this.location.markAsPending();
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
          this.showSnackBar('Failed to fetch location');
          return;
        }
        // Be sure first error shows immediately instead of waiting for field to blur
        this.location.markAsTouched();

        this.filteredLocations = locations;
        this.location.setErrors(locations.length > 0 ? {noMatches: true} : null);
      });

    this.startDate.valueChanges.subscribe(value => {
      this.minDate = value;
    });

    this.filteredLanguages = this.language.valueChanges
        .map(input => input ? this.filterLanguages(input.toString()) : this.languagesData.slice());

    this.form.valueChanges.subscribe(val => {
    });
  }


  trackLanguageById(index: number, language: Location): string {
    return language.id;
  }

  trackLocationById(index: number, location: Location): string {
    return location.id;
  }

  trackByProjectStage(index: number, stage: ProjectStage): string {
    return stage;
  }

  trackByIndex(index: number): number {
    return index;
  }


  onLocationSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedLocations.push(event.option.value);
    if (this.locationChipInput) {
      this.locationChipInput.nativeElement.value = '';
    }
  }

  onLocationBlur(): void {
    if (this.locationChipInput) {
      this.locationChipInput.nativeElement.value = '';
    }
  }

  showLocationName(loc?: Location): string {
    return loc ? `${loc.country} | ${loc.area.name} | ${loc.region.name}` : '';
  }

  filterLanguages(language: string) {
    return this.languagesData
      .filter(item => item.name.toLowerCase().indexOf(language.toLowerCase()) === 0);
  }

  onRemoveLanguage(language: Language): void {
    this.selectedLanguages = this.selectedLanguages.filter((lang) => lang.id !== language.id);
  }

  onRemoveLocation(location: Location): void {
    this.selectedLocations = this.selectedLocations.filter((loc) => loc.id !== location.id);
  }

  onAddLanguage(event: MatAutocompleteSelectedEvent) {
    const language: Language = event.option.value;

    if (!this.selectedLanguages.some(lang => lang.id === language.id)) {
      this.selectedLanguages.push(language);
    }

    if (this.chipInput) {
      this.chipInput.nativeElement.value = '';
    }

    this.language.setValue(this.selectedLanguages);
  }

  private showSnackBar(message: string): void {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
