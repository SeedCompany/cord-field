import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidators } from '../../models/custom-validators';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  reset: boolean;
  submitting = false;

  form: FormGroup = this.fb.group({
    email: ['', CustomValidators.email]
  });

  constructor(private auth: AuthenticationService,
              private fb: FormBuilder,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async onResetPassword(): Promise<void> {
    this.submitting = true;
    await this.auth.forgotPassword(this.form.get('email')!.value);
    this.submitting = false;
    this.reset = true;
  }

}
