import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserProfile } from '../../../../core/models/user';
import { AuthenticationService, isInvalidPasswordError } from '../../../../core/services/authentication.service';
import * as CustomValidators from '../../../../core/validators';

@Component({
  selector: 'app-person-change-password',
  templateUrl: './person-change-password.component.html',
  styleUrls: ['./person-change-password.component.scss'],
})
export class PersonChangePasswordComponent {

  @Input() user: UserProfile;

  expanded = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', [Validators.required]],
  }, {
    validator: CustomValidators.passwordMatch('newPassword'),
  });

  constructor(private authService: AuthenticationService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  async onPasswordChange() {
    if (!this.user.email) {
      throw new Error('User email address not provided');
    }

    this.form.disable();
    try {
      const {currentPassword, newPassword} = this.form.value;
      await this.authService.changePassword(this.user.email, currentPassword, newPassword);
      this.form.enable();
      this.form.reset();
    } catch (res) {
      this.form.enable();

      if (!(res instanceof HttpErrorResponse) || res.status >= 500) {
        this.snackBar.open('Failed to change password', undefined, {duration: 3000});
        return;
      }

      if (res.error.error === 'unauthorized') {
        this.currentPassword.setErrors({invalid: true});
      } else if (isInvalidPasswordError(res.error)) {
        this.newPassword.setErrors({invalid: res.error.feedback});
      }
    }
  }

  get currentPassword(): AbstractControl {
    return this.form.get('currentPassword')!;
  }

  get newPassword(): AbstractControl {
    return this.form.get('newPassword')!;
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword')!;
  }
}
