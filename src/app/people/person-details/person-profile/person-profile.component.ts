import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Organization } from '../../../core/models/organization';
import { ProjectRole } from '../../../core/models/project-role';
import { UserProfile, UserRole } from '../../../core/models/user';
import { PersonAvailabilityDialogComponent } from '../person-availability-dialog/person-availability-dialog.component';
import { PersonRoleLocationsDialogComponent } from '../person-role-locations-dialog/person-role-locations-dialog.component';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss']
})
export class PersonProfileComponent {
  readonly ProjectRole = ProjectRole;

  @Input() user: UserProfile;

  constructor(private dialog: MatDialog) {
  }

  showLocationsByRole(userRole: UserRole): void {
    PersonRoleLocationsDialogComponent.open(this.dialog, userRole);
  }

  onEdit(): void {
    // handle on edit
  }

  showAvailability(): void {
    PersonAvailabilityDialogComponent.open(this.dialog, this.user);
  }

  showOrg(org: Organization): void {
    // handle on Organization
  }
}
