import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { CustomValidators } from '../../core/models/custom-validators';
import { onlyValidValues } from '../../core/models/util';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-location-timeframe',
  templateUrl: './project-location-timeframe.component.html',
  styleUrls: ['./project-location-timeframe.component.scss']
})
export class ProjectLocationTimeframeComponent implements OnInit {
  form: FormGroup;
  minDate: Date;

  constructor(private formBuilder: FormBuilder,
              private projectViewState: ProjectViewStateService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      location: ['', Validators.required],
      mouStart: ['', Validators.required],
      mouEnd: ['', Validators.required]
    }, {
      validator: CustomValidators.dateRange('mouStart', 'mouEnd')
    });

    this.projectViewState.project.subscribe(project => {
      this.form.reset({
        location: project.location,
        mouStart: project.mouStart,
        mouEnd: project.mouEnd
      });
    });

    this.form.valueChanges
      .pipe(onlyValidValues(this.form))
      .subscribe(changes => {
        this.projectViewState.change(changes);
      });

    this.startDate.valueChanges.subscribe(value => {
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
