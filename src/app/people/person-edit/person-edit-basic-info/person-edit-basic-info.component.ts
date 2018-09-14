import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Changes } from '@app/core/change-engine';
import { TitleAware } from '@app/core/decorators';
import { UserProfile } from '@app/core/models/user';
import { onlyValidValues } from '@app/core/util';
import * as CustomValidators from '@app/core/validators';
import { takeUntil } from 'rxjs/operators';

import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-basic-info',
  templateUrl: './person-edit-basic-info.component.html',
  styleUrls: ['./person-edit-basic-info.component.scss']
})
@TitleAware('Edit Basic Info')
export class PersonEditBasicInfoComponent extends AbstractPersonComponent {
  user: UserProfile;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private viewStateSvc: UserViewStateService
  ) {
    super(viewStateSvc);

    this.initForm();
    this.initViewState();
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

  initRolesCtrl(event: AbstractControl): void {
    event.setValue(this.user.roles);

    event.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((changes: Changes) => {
        this.viewStateSvc.change({
          roles: changes
        });
      });
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      displayFirstName: ['', [Validators.required, Validators.minLength(2)]],
      displayLastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, CustomValidators.email]],
      phone: ['', Validators.required]
    });

    this.initFormEvents();
  }

  private initFormEvents(): void {
    this.form.valueChanges
      .pipe(onlyValidValues(this.form))
      .subscribe((changes) => {
        this.viewStateSvc.change({
          realFirstName: changes.firstName,
          realLastName: changes.lastName,
          displayFirstName: changes.displayFirstName,
          displayLastName: changes.displayLastName,
          phone: changes.phone,
          email: changes.email
        });
      });
  }

  private initViewState(): void {
    this.viewStateSvc.user
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user) => {
        this.user = user;

        this.firstName.setValue(user.realFirstName, { emitEvent: false });
        this.lastName.setValue(user.realLastName, { emitEvent: false });
        this.displayFirstName.setValue(user.displayFirstName, { emitEvent: false });
        this.displayLastName.setValue(user.displayLastName, { emitEvent: false });
        this.phone.setValue(user.phone, { emitEvent: false });
        this.email.setValue(user.email, { emitEvent: false });
      });
  }
}
