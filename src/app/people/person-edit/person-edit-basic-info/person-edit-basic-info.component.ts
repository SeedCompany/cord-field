import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TitleAware } from '@app/core/decorators';
import { Unavailability, UserProfile } from '@app/core/models/user';
import { enableControl, onlyValidValues } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import {
PersonAvailabilityCrudDialogComponent,
} from '@app/people/person-edit/person-availability-crud-dialog/person-availability-crud-dialog.component';
import { UserViewStateService } from '@app/people/user-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-person-edit-basic-info',
  templateUrl: './person-edit-basic-info.component.html',
  styleUrls: ['./person-edit-basic-info.component.scss'],
})
@TitleAware('Edit Basic Info')
export class PersonEditBasicInfoComponent extends SubscriptionComponent implements OnInit {
  readonly format = DateTime.DATE_FULL;

  userProfile?: UserProfile;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private viewStateService: UserViewStateService,
    public dialog: MatDialog,
  ) {
    super();

    this.initForm();
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
    this.initFormEvents();
    this.initViewState();
  }

  addAvailability(): void {
    this.editAvailability();
  }

  editAvailability(unavailability?: Unavailability): void {
    PersonAvailabilityCrudDialogComponent.open(this.dialog, {
      viewStateService: this.viewStateService,
      unavailability,
    });
  }

  trackByUnavailabilityId(index: number, item: Unavailability) {
    return item.id;
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      displayFirstName: ['', [Validators.required, Validators.minLength(2)]],
      displayLastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [CustomValidators.phone]],
    });
  }

  private initFormEvents(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        onlyValidValues(this.form),
      )
      .subscribe(changes => {
        this.viewStateService.change({
          realFirstName: changes.firstName,
          realLastName: changes.lastName,
          displayFirstName: changes.displayFirstName,
          displayLastName: changes.displayLastName,
          phone: changes.phone,
          email: changes.email,
        });
      });
  }

  private initViewState(): void {
    this.viewStateService.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(submitting => {
        enableControl(this.form, !submitting);
      });

    this.viewStateService.user
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(userProfile => {
        this.firstName.patchValue(userProfile.realFirstName, { emitEvent: false });
        this.lastName.patchValue(userProfile.realLastName, { emitEvent: false });
        this.displayFirstName.patchValue(userProfile.displayFirstName, { emitEvent: false });
        this.displayLastName.patchValue(userProfile.displayLastName, { emitEvent: false });
        this.phone.patchValue(userProfile.phone, { emitEvent: false });
        this.email.patchValue(userProfile.email, { emitEvent: false });
      });

    this.viewStateService.userWithChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(userProfile => {
        this.userProfile = userProfile;
      });
  }
}
