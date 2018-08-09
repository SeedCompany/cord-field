import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TitleAware } from '../../decorators';
import { AuthenticationService } from '../../services/authentication.service';
import * as CustomValidators from '../../validators';
import { validatePair } from '../../validators/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@TitleAware('Login')
export class LoginComponent {

  hidePassword = true;

  private loginFailed = false;

  form: FormGroup = this.fb.group({
    email: ['', CustomValidators.email],
    password: ['', Validators.required]
  }, {
    // Mark email/password fields invalid on login failure, but remove on change.
    validator: validatePair('email', 'password', 'invalid', () => {
      if (this.loginFailed) {
        this.loginFailed = false;
        return false;
      }

      return true;
    })
  });

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async onLogin() {
    this.form.disable();
    try {
      await this.auth.login(this.email.value, this.password.value, true);
    } catch (err) {
      this.form.enable();

      if (!(err instanceof HttpErrorResponse) || err.status >= 500) {
        this.snackBar.open('Failed to communicate with server', undefined, {duration: 3000});
      } else if (err.error.error === 'login_failed') {
        this.loginFailed = true;
      } else if (err.error.error === 'email_validation_required') {
        this.form.setErrors({emailValidationRequired: true});
      } else if (err.error.error === 'account_not_approved') {
        this.form.setErrors({accountNotApproved: true});
      }
      return;
    }

    this.router.navigateByUrl(await this.auth.popNextUrl() || '/', {replaceUrl: true});
  }

  get email(): AbstractControl {
    return this.form.get('email')!;
  }

  get password(): AbstractControl {
    return this.form.get('password')!;
  }
}
