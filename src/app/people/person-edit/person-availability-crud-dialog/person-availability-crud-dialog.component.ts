import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { RawUnavailability, Unavailability } from '@app/core/models/user';
import * as CustomValidators from '@app/core/validators';
import { UserViewStateService } from '@app/people/user-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';

interface DialogData {
  viewStateService: UserViewStateService;
  unavailability?: Unavailability;
}

@Component({
  selector: 'person-availability-crud-dialog',
  templateUrl: './person-availability-crud-dialog.component.html',
  styleUrls: ['./person-availability-crud-dialog.component.scss'],
})
export class PersonAvailabilityCrudDialogComponent extends SubscriptionComponent implements OnInit {
  readonly form: FormGroup;
  readonly isNew: boolean;
  private readonly viewStateService: UserViewStateService;
  minDate: DateTime;

  constructor(
    @Inject(MAT_DIALOG_DATA) { unavailability, viewStateService }: DialogData,
    private dialogRef: MatDialogRef<PersonAvailabilityCrudDialogComponent>,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.viewStateService = viewStateService;

    this.isNew = !unavailability;
    this.form = this.createForm(unavailability || Unavailability.create());
  }

  get description(): AbstractControl {
    return this.form.get('description')!;
  }

  get startDate(): AbstractControl {
    return this.form.get('start')!;
  }

  get endDate(): AbstractControl {
    return this.form.get('end')!;
  }

  static open(dialog: MatDialog, data: DialogData) {
    return dialog.open(this, {
      width: '40vw',
      minWidth: '500px',
      data,
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

  onSubmit = (unavailability: RawUnavailability, action: string) => {
    this.viewStateService.change({
      unavailabilities: {
        [action === 'delete' ? 'remove' : 'update']: Unavailability.fromForm(unavailability),
      },
    });
  };

  private createForm(unavailability: Unavailability): FormGroup {
    return this.formBuilder.group({
      id: [unavailability.id],
      description: [unavailability.description, Validators.required],
      start: [unavailability.start, Validators.required],
      end: [unavailability.end, Validators.required],
    }, {
      validator: CustomValidators.dateRange('start', 'end'),
    });
  }
}
