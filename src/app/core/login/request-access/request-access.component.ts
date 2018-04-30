import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CustomValidators } from '../../models/custom-validators';
import { IUserRequestAccess } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.scss']
})
export class RequestAccessComponent {

  hidePassword = true;
  serverError: string | null;
  submitting = false;

  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', CustomValidators.email],
    organization: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validator: this.validateForm.bind(this)
  });

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  validateForm(): void {
    // make sure form is initialized
    if (!this.form) { return; }

    // remove previous validation attempt
    const passwordErrors = this.password.errors || {};
    const confirmErrors = this.confirmPassword.errors || {};

    // check for password mismatch
    if (this.passwordsMatch()) {
      // if the passwords match, remove the mismatch error
      delete passwordErrors.passwordMismatch;
      delete confirmErrors.passwordMismatch;
    } else if (this.password.value && this.confirmPassword.value) {
      // if they don't match, and both fields have a value
      // set the mismatch error
      passwordErrors.passwordMismatch = true;
      confirmErrors.passwordMismatch = true;
    }

    // if there are errors, ensure they are set on the fields
    // otherwise set them to null so the error is cleared
    this.setOrClearErrors(this.password, passwordErrors);
    this.setOrClearErrors(this.confirmPassword, confirmErrors);
  }

  setOrClearErrors(field: AbstractControl, errors: any): void {
    const err = (Object.keys(errors).length > 0) ? errors : null;
    field.setErrors(err);
  }

  passwordsMatch(): boolean {
    return this.password.value === this.confirmPassword.value;
  }

  async onRequestAccess() {
    this.submitting = true;
    this.form.disable();
    const {confirmPassword, ...user} = this.form.value as IUserRequestAccess & { confirmPassword: string };

    try {
      await this.authService.requestAccess(user);
    } catch (e) {
      if (e.message === 'SERVER_ERROR') {
        this.showSnackBar('Sorry, failed to create your account, Please try again or contact Field Support Services for assistance.');
      } else {
        this.serverError = e.message;
      }
      return;
    } finally {
      this.submitting = false;
      this.form.enable();
    }

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
