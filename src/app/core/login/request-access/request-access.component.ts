import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
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
  loading = false;
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
      this
        .snackBar
        .openFromComponent(SnackBarComponent, {
          data: 'Please activate your account by clicking on the link sent to your email'
        });
      this.router.navigate(['/login']);
    } catch (e) {
      this.loading = false;
      this.serverError = e.message;
      this.showSnackBar('Failed to Create Account');
      return;
    } finally {
      this.submitting = false;
      this.form.enable();
    }
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
