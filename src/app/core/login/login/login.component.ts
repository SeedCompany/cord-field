import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustomValidators } from '../../models/custom-validators';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hidePassword = true;
  serverError: string;
  submitting = false;

  form: FormGroup = this.fb.group({
    email: ['', CustomValidators.email],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private router: Router,
              private logService: LoggerService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async onLogin() {
    this.submitting = true;
    this.form.disable();
    try {
      await this.auth.login(this.email.value, this.password.value, true);
    } catch (err) {
      this.serverError = err.message;
      return;
    } finally {
      this.submitting = false;
      this.form.enable();
    }

    this.router.navigate(['/']);
  }

  get email(): AbstractControl {
    return this.form.get('email')!;
  }

  get password(): AbstractControl {
    return this.form.get('password')!;
  }

}
