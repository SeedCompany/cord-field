import { Component, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../../core/models/language';
import { Location } from '../../../core/models/location';
import {
  ProjectFilter,
  ProjectSensitivity,
  ProjectStage,
  ProjectStatus,
  ProjectType
} from '../../../core/models/project';
import { User } from '../../../core/models/user';
import * as CustomValidators from '../../../core/validators';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss']
})
export class ProjectListFilterComponent implements OnInit {

  readonly ProjectStage = ProjectStage;
  readonly ProjectStatus = ProjectStatus;
  readonly ProjectType = ProjectType;
  readonly ProjectSensitivity = ProjectSensitivity;

  form = this.formBuilder.group({
    languages: [[]],
    location: [[]],
    team: [[]],
    status: [null],
    stage: [null],
    type: [null],
    sensitivity: [null],
    dateRange: [null],
    startDate: [null],
    endDate: [null]
  }, {
    validator: CustomValidators.dateRange('startDate', 'endDate')
  });
  minDate: DateTime;
  maxDate = DateTime.local();

  constructor(private formBuilder: FormBuilder) {
  }

  get languages(): AbstractControl {
    return this.form.get('languages')!;
  }

  get locations(): AbstractControl {
    return this.form.get('location')!;
  }

  get users(): AbstractControl {
    return this.form.get('team')!;
  }

  get dateRange(): AbstractControl {
    return this.form.get('dateRange')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('startDate')!;
  }

  get endDate(): AbstractControl {
    return this.form.get('endDate')!;
  }

  @Output() get filters(): Observable<ProjectFilter> {
    return this.form.valueChanges
      .map(filters => {
        const result: any = {};
        for (const [key, value] of Object.entries(filters)) {
          if (!value) {
            continue;
          }
          if (Array.isArray(value)) {
            if (value.length === 0) {
              continue;
            }
          }

          result[key] = value;
        }

        return result;
      });
  }

  ngOnInit() {
    this.startDate.valueChanges.subscribe(date => {
      this.minDate = date;
      if (this.endDate.value && this.endDate.value < date) {
        this.endDate.setValue(date);
      }
    });
  }

  onLanguageSelected(language: Language): void {
    this.languages.setValue([...this.languages.value, language]);
  }

  onLanguageRemoved(language: Language): void {
    this.languages.setValue((this.languages.value as Language[]).filter(lang => lang.id !== language.id));
  }

  onLocationSelected(location: Location): void {
    this.locations.setValue([...this.locations.value, location]);
  }

  onLocationRemoved(location: Location): void {
    this.locations.setValue((this.locations.value as Location[]).filter(loc => loc.id !== location.id));
  }

  onUserSelected(user: User): void {
    this.users.setValue([...this.users.value, user]);
  }

  onUserRemoved(user: User): void {
    this.users.setValue((this.users.value as User[]).filter(u => u.id !== user.id));
  }

  reset() {
    this.form.reset({
      languages: [],
      location: [],
      team: []
    });
  }
}
