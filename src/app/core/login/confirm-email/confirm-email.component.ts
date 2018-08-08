import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  token: string;
  submitting = true;
  clientError = false;
  serverError = false;

  constructor(private auth: AuthenticationService,
              private route: ActivatedRoute,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams.token;
    this.verifyConfirmationToken();
  }

  async verifyConfirmationToken() {
    try {
      await this.auth.confirmEmail(this.token);
    } catch (e) {
      !(e instanceof HttpErrorResponse) || e.status >= 500
        ? this.serverError = true
        : this.clientError = true;
    } finally {
      this.submitting = false;
    }
  }

  get success() {
    return !this.submitting && !this.clientError && !this.serverError;
  }
}
