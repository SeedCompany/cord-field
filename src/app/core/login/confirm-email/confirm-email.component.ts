import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  token: string;
  isValidToken: boolean;
  serverError: boolean;

  constructor(private auth: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private logService: LoggerService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async ngOnInit() {
    try {
      this.token = this.route.snapshot.queryParams.token ? this.route.snapshot.queryParams.token : 'invalid';
      await this.verifyConfirmationToken();
    } catch (e) {
      this.logService.error(e.message, 'error at grabbing confirm email token from url');
    }
  }

  async verifyConfirmationToken() {
    try {
      await this.auth.confirmEmail(this.token);
      this.isValidToken = true;
    } catch (e) {
      if (e.error === 'invalid_token') {
        this.isValidToken = false;
      } else if (e.error === 'internal_server_error') {
        this.serverError = true;
      }

    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

}
