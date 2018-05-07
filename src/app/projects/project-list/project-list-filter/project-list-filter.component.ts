import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Language } from '../../../core/models/language';
import { Location } from '../../../core/models/location';
import { ProjectSensitivities, ProjectStage, ProjectStatus, ProjectType } from '../../../core/models/project';
import { LanguageService } from '../../../core/services/language.service';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss']
})
export class ProjectListFilterComponent implements OnInit {

  readonly ProjectStage = ProjectStage;
  readonly ProjectStatus = ProjectStatus;
  readonly ProjectType = ProjectType;
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
  filteredLanguages: Language[] = [];

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

        if (locations instanceof HttpErrorResponse) {
          this.showSnackBar('Failed to fetch locations');
          return;
        }
        // Be sure first error shows immediately instead of waiting for field to blur
        this.location.markAsTouched();

        const currentIds = this.selectedLocations.map(loc => loc.id);
        locations = locations.filter(loc => !currentIds.includes(loc.id));

        this.filteredLocations = locations;
        this.location.setErrors(locations.length === 0 ? {noMatches: true} : null);
      });

    this.startDate.valueChanges.subscribe(value => {
      this.minDate = value;
    });

    this.language.valueChanges
      .filter(lang => typeof lang === 'string')
      .startWith('')
      .map(lang => lang.trim())
      .filter(lang => lang.length > 1)
      .debounceTime(500)
      .do(() => {
        this.filteredLanguages.length = 0;
        this.language.markAsPending();
      })
      .switchMap(async (term: string) => {
        try {
          return await this.languageService.search(term);
        } catch (e) {
          return e; // returning error to prevent observable from completing
        }
      })
      .subscribe((languages: Language[] | HttpErrorResponse) => {

        if (languages instanceof HttpErrorResponse) {
          this.showSnackBar('Failed to fetch languages');
          return;
        }
        // Be sure first error shows immediately instead of waiting for field to blur
        this.language.markAsTouched();

        const currentIds = this.selectedLanguages.map(lang => lang.id);
        languages = languages.filter(lang => !currentIds.includes(lang.id));

        this.filteredLanguages = languages;
        this.language.setErrors(languages.length === 0 ? {noMatches: true} : null);
      });

    this.form.valueChanges.subscribe(val => {
    });
  }


  trackLanguageById(index: number, language: Location): string {
    return language.id;
  }

  trackLocationById(index: number, location: Location): string {
    return location.id;
  }

  trackByIndex(index: number): number {
    return index;
  }


  onLocationSelected(event: MatAutocompleteSelectedEvent): void {
    const location: Location = event.option.value;

    if (!this.selectedLocations.some(loc => loc.id === location.id)) {
      this.selectedLocations.push(event.option.value);
      this.filteredLocations.length = 0;
    }
    if (this.locationChipInput) {
      this.locationChipInput.nativeElement.value = '';
    }
  }

  onLocationBlur(): void {
    if (this.locationChipInput) {
      this.locationChipInput.nativeElement.value = '';
    }
    this.location.setErrors(null);
  }

  showLocationName(loc?: Location): string {
    return loc ? `${loc.country} | ${loc.area.name} | ${loc.region.name}` : '';
  }

  onRemoveLocation(location: Location): void {
    this.selectedLocations = this.selectedLocations.filter((loc) => loc.id !== location.id);
  }

  onRemoveLanguage(language: Language): void {
    this.selectedLanguages = this.selectedLanguages.filter((lang) => lang.id !== language.id);
  }

  onLanguageSelected(event: MatAutocompleteSelectedEvent) {
    const language: Language = event.option.value;

    if (!this.selectedLanguages.some(lang => lang.id === language.id)) {
      this.selectedLanguages.push(language);
      this.filteredLanguages.length = 0;
    }

    if (this.chipInput) {
      this.chipInput.nativeElement.value = '';
    }
  }

  onLanguageBlur(): void {
    if (this.chipInput) {
      this.chipInput.nativeElement.value = '';
    }
    this.language.setErrors(null);
  }

  private showSnackBar(message: string): void {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
