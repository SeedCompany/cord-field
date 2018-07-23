import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TitleAware } from '../../decorators';
import { IUserRequestAccess } from '../../models/user';
import { AuthenticationService, isInvalidPasswordError } from '../../services/authentication.service';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.scss']
})
@TitleAware('Request Access')
export class RequestAccessComponent {

  hidePassword = true;
  serverError: string | null;

  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', CustomValidators.email],
    organization: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validator: CustomValidators.passwordMatch()
  });

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  async onRequestAccess() {
    this.form.disable();
    const {confirmPassword, ...user} = this.form.value as IUserRequestAccess & { confirmPassword: string };

    try {
      await this.authService.requestAccess(user);
    } catch (e) {
      this.form.enable();

      if (!(e instanceof HttpErrorResponse) || e.status >= 500) {
        this.showSnackBar('Failed to request access');
      } else if (e.error.error === 'invalid_email') {
        this.email.setErrors({invalidEmail: true});
      } else if (isInvalidPasswordError(e.error)) {
        this.password.setErrors({invalid: e.error.feedback});
      } else {
        this.form.setErrors({unknown: true});
      }

      return;
    }
    this.form.enable();

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    const ref = this.snackBar.open('Please activate your account by clicking on the link sent to your email', 'Close');
    ref.onAction().subscribe(() => ref.dismiss());
    this.router.navigate(['/login']);
  }

  get email(): AbstractControl {
    return this.form.get('email')!;
  }

  get password(): AbstractControl {
    return this.form.get('password')!;
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword')!;
  }

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 300
    });
  }
}
