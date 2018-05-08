import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Language } from '../../../core/models/language';
import { Location } from '../../../core/models/location';
import { ProjectSensitivities, ProjectStage, ProjectStatus, ProjectType } from '../../../core/models/project';

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
    sensitivity: [''],
    dateRange: [''],
    startDate: [''],
    endDate: ['']
  });

  languages: Language[] = [];
  locations: Location[] = [];

  @ViewChild('chipInput') chipInput: ElementRef;
  @ViewChild('locationChipInput') locationChipInput: ElementRef;

  constructor(private formBuilder: FormBuilder) {
  }

  get dateRange(): AbstractControl {
    return this.form.get('dateRange')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('startDate')!;
  }

  ngOnInit() {
    this.startDate.valueChanges.subscribe(value => {
      this.minDate = value;
    });

    this.form.valueChanges.subscribe(val => {
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onLanguageSelected(language: Language): void {
    this.languages.push(language);
  }

  onLanguageRemoved(language: Language): void {
    this.languages = this.languages.filter((lang) => lang.id !== language.id);
  }

  onLocationSelected(location: Location): void {
    this.locations.push(location);
  }

  onLocationRemoved(location: Location): void {
    this.locations = this.locations.filter((loc) => loc.id !== location.id);
  }
}
