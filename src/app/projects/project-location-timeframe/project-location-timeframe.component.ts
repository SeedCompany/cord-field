import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { DateTime } from 'luxon';
import { CustomValidators } from '../../core/models/custom-validators';
import { onlyValidValues } from '../../core/util';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss']
})
export class ProjectLocationTimeframeComponent extends SubscriptionComponent implements OnInit {
  form: FormGroup;
  minDate: DateTime;

  constructor(private formBuilder: FormBuilder,
              private projectViewState: ProjectViewStateService) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      location: ['', Validators.required],
      mouStart: ['', Validators.required],
      mouEnd: ['', Validators.required]
    }, {
      validator: CustomValidators.dateRange('mouStart', 'mouEnd', false)
    });

    this.projectViewState.project
      .takeUntil(this.unsubscribe)
      .subscribe(project => {
        this.form.reset({
          location: project.location,
          mouStart: project.mouStart,
          mouEnd: project.mouEnd
        });
      });

    this.form.valueChanges
      .takeUntil(this.unsubscribe)
      .pipe(onlyValidValues(this.form))
      .subscribe(changes => {
        this.projectViewState.change(changes);
      });

    this.startDate.valueChanges
      .takeUntil(this.unsubscribe)
      .subscribe(value => {
        this.minDate = value;
      });
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
}
