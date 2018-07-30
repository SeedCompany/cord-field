import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import * as CustomValidators from '../../../core/validators';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-account',
  templateUrl: './person-edit-account.component.html',
  styleUrls: ['./person-edit-account.component.scss']
})
export class PersonEditAccountComponent extends AbstractPersonComponent {

  expanded = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  submitting = false;
  serverError: string;

  form: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', [Validators.required]]
  }, {
    validator: CustomValidators.passwordMatch('newPassword')
  });

  constructor(private authService: AuthenticationService,
              private fb: FormBuilder,
              userViewState: UserViewStateService) {
    super(userViewState);
  }

  async onPasswordChange() {
    this.submitting = true;
    this.form.disable();
    this.serverError = '';
    try {
      if (!this.user.email) {
        throw new Error(`${this.user.fullName}'s email address not found`);
      }
      const {currentPassword, newPassword} = this.form.value;
      await this.authService.changePassword(this.user.email, currentPassword, newPassword);
    } catch (err) {
      this.serverError = err.message;
      return;
    } finally {
      this.submitting = false;
      this.form.reset({});
      this.form.enable();
    }
  }

  get newPassword(): AbstractControl {
    return this.form.get('newPassword')!;
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword')!;
  }
}
