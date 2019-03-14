import { Component, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { InternshipStatus } from '@app/core/models/internship';
import { Location } from '@app/core/models/location';
import { ProjectFilter } from '@app/core/models/project';
import { Sensitivity } from '@app/core/models/sensitivity';
import { User } from '@app/core/models/user';
import { filterValues, hasValue } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { TableViewFilters } from '@app/shared/components/table-view/table-filter.directive';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-internship-list-filter',
  templateUrl: './internship-list-filter.component.html',
  styleUrls: ['./internship-list-filter.component.scss'],
})
export class InternshipListFilterComponent implements TableViewFilters<ProjectFilter>, OnInit {
  form: FormGroup;
  minDate: DateTime;
  maxDate = DateTime.local();

  readonly InternshipStatus = InternshipStatus;
  readonly Sensitivity = Sensitivity;

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
        map(filters => filterValues(filters, hasValue)),
      );
  }

  onLocationRemoved(location: Location): void {
    this.locations.setValue((this.locations.value as Location[]).filter((loc) => loc.id !== location.id));
  }

  onUserRemoved(user: User): void {
    this.users.setValue((this.users.value as User[]).filter((u) => u.id !== user.id));
  }

  reset() {
    this.form.reset({
      location: [],
      team: [],
    });
  }

  private _initForm(): void {
    this.form = this.formBuilder.group({
      location: [[]],
      team: [[]],
      status: [null],
      sensitivity: [null],
      dateRange: [null],
      startDate: [null],
      endDate: [null],
    }, {
      validator: CustomValidators.dateRange('startDate', 'endDate'),
    });
  }
}
