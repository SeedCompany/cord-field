import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationStorageService } from '../../../core/services/authentication-storage.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthenticationService,
              private authStore: AuthenticationStorageService,
              private router: Router,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  ngOnInit() {
    const tokens = this
      .authStore
      .getAuthenticationTokens();
    console.log('Tokens are', tokens);
  }

  logout() {
    this
      .auth
      .logout();
    this.router.navigate(['/login']);
  }
}
