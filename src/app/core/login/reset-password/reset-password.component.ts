import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, isInvalidPasswordError } from '../../services/authentication.service';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  token: string | null;
  hidePassword = true;

  form: FormGroup = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validator: CustomValidators.passwordMatch()
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams.token;
  }

  get password(): AbstractControl {
    return this.form.get('password')!;
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword')!;
  }

  async onResetPassword(): Promise<void> {
    try {
      await this.auth.resetPassword(this.token!, this.password.value);
    } catch (e) {
      if (!(e instanceof HttpErrorResponse) || e.status >= 500) {
        this.snackBar.open('Failed to reset password', undefined, {duration: 300});
      } else if (e.error.error === 'invalid_token') {
        this.token = null;
      } else if (isInvalidPasswordError(e.error)) {
        this.password.setErrors({invalid: e.error.feedback});
      } else {
        this.form.setErrors({unknown: true});
      }

      return;
    }

    this.snackBar.open('Successfully reset your password', undefined, {duration: 300});
    this.router.navigateByUrl('/login');
  }
}
