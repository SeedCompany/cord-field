import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    confirmPassword: ['', Validators.required, this.validatePasswords.bind(this)]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  async validatePasswords() {
    return this.password.value === this.confirmPassword.value ? null : {mismatchedPassword: true};
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
      }
      this.serverError = e.message;
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

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, null, {
      duration: 300
    });
  }
}
