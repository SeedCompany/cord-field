import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../models/custom-validators';
import { IUserRequestAccess } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.scss']
})
export class RequestAccessComponent {

  hidePassword = true;

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required, this.validateEmail.bind(this)],
    organization: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required, this.validatePasswords.bind(this)]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private logService: LoggerService) {
  }

  async validatePasswords() {
    return this.password.value === this.confirmPassword.value ? null : {mismatchedPassword: true};
  }

  async validateEmail() {
    return CustomValidators.isValidEmail(this.email.value) ? null : {invalidEmail: true};
  }

  onRequestAccess() {
    const {confirmPassword, ...user} = this.form.value as IUserRequestAccess & { confirmPassword: string };

    this
      .authService
      .requestAccess(user)
      .toPromise()
      .then(() => this.router.navigate(['/login']))
      .catch((err) => this.logService.error(err, 'error at request access'));
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
}
