import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { Internship } from '@app/core/models/internship';
import { Location } from '@app/core/models/location';
import { Project } from '@app/core/models/project';
import { TypedFormGroup } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs/operators';

interface Form {
  location: Location | null;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  estimatedSubmission: DateTime | null;
}

@Component({
  selector: 'app-location-timeframe',
  templateUrl: './location-timeframe.component.html',
  styleUrls: ['./location-timeframe.component.scss'],
})
export class LocationTimeframeComponent extends SubscriptionComponent implements OnInit {
  form: TypedFormGroup<Form>;
  minDate: DateTime;
  today: DateTime = DateTime.utc();

  constructor(
    private projectViewState: AbstractViewState<Project | Internship, unknown>,
  ) {
    super();
  }

  get location(): AbstractControl {
    return this.form.get('location')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('mouStart')!;
  }

  get endDate(): AbstractControl {
    return this.form.get('mouEnd')!;
  }

  get estimatedSubmissionDate(): AbstractControl {
    return this.form.get('estimatedSubmission')!;
  }

  ngOnInit(): void {
    this.form = this.projectViewState.fb.group<Form>(this.unsubscribe, {
      location: { validators: [Validators.required] },
      mouStart: { validators: [Validators.required] },
      mouEnd: { validators: [Validators.required] },
      estimatedSubmission: {},
    });
    this.form.setValidators([
      CustomValidators.dateRange('mouStart', 'mouEnd', false),
    ]);

    this.startDate.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.minDate = value;
      });
  }
}
