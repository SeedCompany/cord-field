import { Component, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Language } from '@app/core/models/language';
import { Location } from '@app/core/models/location';
import { ProjectFilter, ProjectSensitivity, ProjectStatus, ProjectType } from '@app/core/models/project';
import { User } from '@app/core/models/user';
import { filterEntries, hasValue } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { TableViewFilters } from '@app/shared/components/table-view/table-filter.directive';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss'],
})
export class ProjectListFilterComponent implements TableViewFilters<ProjectFilter>, OnInit {
  form: FormGroup;
  minDate: DateTime;
  maxDate = DateTime.local();

  readonly ProjectStatus = ProjectStatus;
  readonly ProjectType = ProjectType;
  readonly ProjectSensitivity = ProjectSensitivity;

  constructor(private formBuilder: FormBuilder) {
    this._initForm();
  }

  ngOnInit(): void {
    this.startDate.valueChanges.subscribe((date) => {
      this.minDate = date;
      if (this.endDate.value && this.endDate.value < date) {
        this.endDate.setValue(date);
      }
    });
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
      .pipe(
        startWith(this.form.value),
        map(filters =>
          filterEntries(filters, (key, value) => hasValue(value)),
        ),
      );
  }

  onLanguageRemoved(language: Language): void {
    this.languages.setValue((this.languages.value as Language[]).filter((lang) => lang.id !== language.id));
  }

  onLocationRemoved(location: Location): void {
    this.locations.setValue((this.locations.value as Location[]).filter((loc) => loc.id !== location.id));
  }

  onUserRemoved(user: User): void {
    this.users.setValue((this.users.value as User[]).filter((u) => u.id !== user.id));
  }

  reset() {
    this.form.reset({
      languages: [],
      location: [],
      team: [],
    });
  }

  private _initForm(): void {
    this.form = this.formBuilder.group({
      languages: [[]],
      location: [[]],
      team: [[]],
      status: [null],
      type: [null],
      sensitivity: [null],
      dateRange: [null],
      startDate: [null],
      endDate: [null],
    }, {
        validator: CustomValidators.dateRange('startDate', 'endDate'),
      });
  }
}
