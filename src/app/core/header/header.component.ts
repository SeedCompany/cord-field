import { Component, OnInit } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PersonCreateDialogComponent } from '../create-dialogs/person-create-dialog/person-create-dialog.component';
import { ProjectCreateDialogComponent } from '../create-dialogs/project-create-dialog/project-create-dialog.component';
import { TitleAware } from '../decorators';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
@TitleAware()
export class HeaderComponent implements OnInit {
  currentUser: User | null;

  constructor(private auth: AuthenticationService,
              private router: Router,
              private dialog: MatDialog,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('cord', sanitizer.bypassSecurityTrustResourceUrl('assets/images/cord-icon.svg'));
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  async ngOnInit() {
    this.currentUser = await this.auth.getCurrentUser();
  }

  onCreateProject(): void {
    ProjectCreateDialogComponent.open(this.dialog);
  }

  onCreatePerson(): void {
    PersonCreateDialogComponent.open(this.dialog);
  }
}
