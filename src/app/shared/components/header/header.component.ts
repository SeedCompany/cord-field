import {
  Component,
  OnInit
} from '@angular/core';
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
export class HeaderComponent {
  constructor(private auth: AuthenticationService,
              private authStore: AuthenticationStorageService,
              private router: Router,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
