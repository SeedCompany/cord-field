import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '../../decorators';
import { AuthenticationService, isInvalidPasswordError } from '../../services/authentication.service';
import * as CustomValidators from '../../validators';
import { validatePair } from '../../validators/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@TitleAware('Login')
export class LoginComponent implements OnInit {

  @ViewChild('newPwd') newPwd: ElementRef;

  hidePassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  pwdReset = false;
  private loginFailed = false;


  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, CustomValidators.email]],
    password: ['', Validators.required],
    newPassword: [''],
    confirmPassword: ['']
  }, {
    validator: [
      // Mark email/password fields invalid on login failure, but remove on change.
      validatePair('email', 'password', 'invalid', () => {
        if (this.loginFailed) {
          this.loginFailed = false;
          return false;
        }

        return true;
      }),
      CustomValidators.passwordMatch('newPassword')
    ]
  });

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.pwr === 'true') {
        this.passwordResetRequired();
      }
    });
  }

  async onLogin() {
    this.form.disable();
    try {
      await this.auth.login(this.email.value, this.password.value, true,
        this.pwdReset ? this.newPassword.value : undefined);
    } catch (err) {
      this.form.enable();

      if (!(err instanceof HttpErrorResponse) || err.status >= 500) {
        this.snackBar.open('Failed to communicate with server', undefined, {duration: 3000});
      } else if (err.error.error === 'login_failed') {
        this.loginFailed = true;
        this.form.updateValueAndValidity();
      } else if (err.error.error === 'email_validation_required') {
        this.form.setErrors({emailValidationRequired: true});
      } else if (err.error.error === 'account_not_approved') {
        this.form.setErrors({accountNotApproved: true});
      } else if (err.error.error === 'reset_password_required') {
        this.passwordResetRequired();
        this.newPwd.nativeElement.focus();
        this.form.setErrors({resetPassword: true});
      } else if (isInvalidPasswordError(err.error)) {
        this.newPassword.setErrors({invalid: err.error.feedback});
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

  get newPassword(): AbstractControl {
    return this.form.get('newPassword')!;
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword')!;
  }

  private passwordResetRequired() {
    this.pwdReset = true;
    this.newPassword.setValidators([Validators.required]);
    this.confirmPassword.setValidators([Validators.required]);
  }
}
