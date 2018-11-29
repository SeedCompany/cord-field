import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { onlyValidValues } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs/operators';

import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss'],
})
export class ProjectLocationTimeframeComponent extends SubscriptionComponent {
  form: FormGroup;
  minDate: DateTime;
  today: DateTime = DateTime.utc();

  constructor(
    private formBuilder: FormBuilder,
    private projectViewState: ProjectViewStateService,
  ) {
    super();

    this._initForm();
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

  private _initForm(): void {
    this.form = this.formBuilder.group({
      location: ['', Validators.required],
      mouStart: ['', Validators.required],
      mouEnd: ['', Validators.required],
      estimatedSubmission: [''],
    }, {
      validator: CustomValidators.dateRange('mouStart', 'mouEnd', false),
    });

    this.projectViewState.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state) => {
        this.form.reset({
          location: state.location,
          mouStart: state.mouStart,
          mouEnd: state.mouEnd,
          estimatedSubmission: state.estimatedSubmission,
        });
      });

    this._initFormEvents();
  }

  private _initFormEvents(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .pipe(onlyValidValues(this.form))
      .subscribe((value) => {
        this.projectViewState.change(value);
      });

    this.startDate.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.minDate = value;
      });
  }
}
