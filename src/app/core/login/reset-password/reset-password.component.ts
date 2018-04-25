import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  token: string;
  hidePassword = true;
  submitting = false;
  reset = {
    isSubmitted: false,
    status: false,
    msg: ''
  };

  form: FormGroup = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required, this.validatePasswords.bind(this)]
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              private logService: LoggerService,
              private route: ActivatedRoute,
              private router: Router,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams.token
      ? this.route.snapshot.queryParams.token
      : '';
    if (this.token.length === 0) {
      this.router.navigate(['/login']);
    }
  }

  async validatePasswords(): Promise<null | {}> {
    return this.password.value === this.confirmPassword.value ? null : {mismatchedPassword: true};
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.form.get('confirmPassword');
  }

  async onResetPassword(): Promise<void> {
    this.reset.isSubmitted = true;
    try {
      await this.auth.resetPassword(this.token, this.password.value);
      this.reset.status = true;
    } catch (e) {
      this.reset.status = false;
      this.reset.msg = e.message;
    } finally {
      this.submitting = false;
    }
  }

}
