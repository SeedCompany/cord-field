import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Unavailability } from '@app/core/models/user';
import * as CustomValidators from '@app/core/validators';
import { UserViewStateService } from '@app/people/user-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';

interface DialogData {
  viewStateService: UserViewStateService;
  unavailability: Unavailability;
}

@Component({
  selector: 'person-availability-crud-dialog',
  templateUrl: './person-availability-crud-dialog.component.html',
  styleUrls: ['./person-availability-crud-dialog.component.scss']
})
export class PersonAvailabilityCrudDialogComponent extends SubscriptionComponent implements OnInit {
  form: FormGroup;
  minDate: DateTime;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private dialogRef: MatDialogRef<PersonAvailabilityCrudDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    super();

    this.initForm();
  }

  get id(): AbstractControl {
    return this.form.get('id')!;
  }

  get description(): AbstractControl {
    return this.form.get('description')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('startDate')!;
  }

  get endDate(): AbstractControl {
    return this.form.get('endDate')!;
  }

  static open(dialog: MatDialog, dialogData: DialogData) {
    return dialog.open(this, {
      width: '40vw',
      minWidth: '500px',
      autoFocus: true,
      data: dialogData
    });
  }

  ngOnInit(): void {
    this.startDate.valueChanges.subscribe((date) => {
      this.minDate = date;

      if (this.endDate.value && this.endDate.value < date) {
        this.endDate.setValue(date);
      }
    });
  }

  onAdd(): void {
    this.dialogData.viewStateService.change({
      unavailabilities: {
        update: {
          id: this.id.value,
          description: this.description.value,
          start: this.startDate.value,
          end: this.endDate.value
        }
      }
    });

    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogData.viewStateService.change(
      { unavailabilities: { remove: this.dialogData.unavailability } }
    );

    this.dialogRef.close();
  }

  private initForm(): void {
    const unavailability = this.dialogData.unavailability;
    this.form = this.formBuilder.group({
      id: [unavailability.id],
      description: [unavailability.description, Validators.required],
      startDate: [unavailability.start, Validators.required],
      endDate: [unavailability.end, Validators.required]
    }, {
      validator: CustomValidators.dateRange('startDate', 'endDate')
    });
  }
}
