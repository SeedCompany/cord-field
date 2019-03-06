import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TitleAware } from '@app/core/decorators';
import { Unavailability, UserProfile } from '@app/core/models/user';
import { TypedFormGroup } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { AbstractPersonComponent } from '@app/people/person-edit/abstract-person.component';
import {
PersonAvailabilityCrudDialogComponent,
} from '@app/people/person-edit/person-availability-crud-dialog/person-availability-crud-dialog.component';
import { UserViewStateService } from '@app/people/user-view-state.service';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs/operators';

interface Form {
  firstName: string;
  lastName: string;
  displayFirstName: string;
  displayLastName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-person-edit-basic-info',
  templateUrl: './person-edit-basic-info.component.html',
  styleUrls: ['./person-edit-basic-info.component.scss'],
})
@TitleAware('Edit Basic Info')
export class PersonEditBasicInfoComponent extends AbstractPersonComponent implements OnInit {
  readonly format = DateTime.DATE_FULL;

  userProfile?: UserProfile;
  form: TypedFormGroup<Form>;

  constructor(
    private formBuilder: FormBuilder,
    userViewState: UserViewStateService,
    public dialog: MatDialog,
  ) {
    super(userViewState);
  }

  get firstName(): AbstractControl {
    return this.form.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.form.get('lastName')!;
  }

  get displayFirstName(): AbstractControl {
    return this.form.get('displayFirstName')!;
  }

  get displayLastName(): AbstractControl {
    return this.form.get('displayLastName')!;
  }

  get email(): AbstractControl {
    return this.form.get('email')!;
  }

  get phone(): AbstractControl {
    return this.form.get('phone')!;
  }

  ngOnInit(): void {
    super.ngOnInit();

    const toString = (name: string | null) => name || '';
    this.form = this.userViewState.fb.group<Form>(this.unsubscribe, {
      firstName: {
        field: 'realFirstName',
        validators: [Validators.required, Validators.minLength(2)],
        modelToForm: toString,
      },
      lastName: {
        field: 'realLastName',
        validators: [Validators.required, Validators.minLength(2)],
        modelToForm: toString,
      },
      displayFirstName: {
        validators: [Validators.required, Validators.minLength(2)],
      },
      displayLastName: {
        validators: [Validators.required, Validators.minLength(2)],
      },
      email: {
        validators: [Validators.required, CustomValidators.email],
        modelToForm: toString,
      },
      phone: {
        validators: [CustomValidators.phone],
        modelToForm: toString,
      },
    });

    this.userViewState.userWithChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(userProfile => {
        this.userProfile = userProfile;
      });
  }

  addAvailability(): void {
    this.editAvailability();
  }

  editAvailability(unavailability?: Unavailability): void {
    PersonAvailabilityCrudDialogComponent.open(this.dialog, {
      viewStateService: this.userViewState,
      unavailability,
    });
  }

  trackByUnavailabilityId(index: number, item: Unavailability) {
    return item.id;
  }
}
