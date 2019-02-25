import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { Location } from '@app/core/models/location';
import { TypedFormGroup } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

interface Form {
  location: Location | null;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  estimatedSubmission: DateTime | null;
}

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss'],
})
export class ProjectLocationTimeframeComponent extends SubscriptionComponent implements OnInit {
  form: TypedFormGroup<Form>;
  minDate: DateTime;
  today: DateTime = DateTime.utc();

  constructor(
    private projectViewState: ProjectViewStateService,
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
