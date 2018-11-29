import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TitleAware } from '../../decorators';
import { AuthenticationService } from '../../services/authentication.service';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
@TitleAware('Forgot Password')
export class ForgotPasswordComponent {

  reset = false;

  form: FormGroup = this.fb.group({
    email: ['', CustomValidators.email],
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async onResetPassword(): Promise<void> {
    this.form.disable();
    try {
      await this.auth.forgotPassword(this.form.get('email')!.value);
    } finally {
      this.form.enable();
    }
    this.reset = true;
  }
}
