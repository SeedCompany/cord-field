import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hidePassword = true;

  form: FormGroup = this.fb.group({
    email: ['', Validators.email],
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

  onLogin() {
    this
      .auth
      .login(this.email.value, this.password.value, true)
      .toPromise()
      .then(() => this.router.navigate(['/']))
      .catch((err) => this.logService.error(err, 'error at onLogin'));
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
