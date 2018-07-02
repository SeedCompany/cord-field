import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Organization } from '../../../core/models/organization';
import { ProjectRole } from '../../../core/models/project-role';
import { UserProfile, UserRole } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { PersonAvailabilityDialogComponent } from '../person-availability-dialog/person-availability-dialog.component';
import { PersonLocationsByRoleDialogComponent } from '../person-locations-by-role-dialog/person-locations-by-role-dialog.component';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss']
})
export class PersonProfileComponent implements OnInit, OnDestroy {
  readonly ProjectRole = ProjectRole;
  user: UserProfile;
  private userProfileSub: Subscription = Subscription.EMPTY;

  constructor(private userService: UserService,
              private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.userProfileSub = this.userService.userProfile$.subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.userProfileSub.unsubscribe();
  }

  showLocationsByRole(userRole: UserRole): void {
    this.dialog.open(PersonLocationsByRoleDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: userRole
    });
  }

  onEdit(): void {
    // handle on edit
  }

  showAvailability(): void {
    this.dialog.open(PersonAvailabilityDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: this.user
    });
  }

  showOrg(org: Organization): void {
    // handle on Organization
  }
}
