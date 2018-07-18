import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DateTime } from 'luxon';
import { Organization } from '../../../core/models/organization';
import { ProjectRole } from '../../../core/models/project-role';
import { UserProfile, UserRole } from '../../../core/models/user';
import { PersonAvailabilityDialogComponent } from '../person-availability-dialog/person-availability-dialog.component';
import { PersonRoleLocationsDialogComponent } from '../person-role-locations-dialog/person-role-locations-dialog.component';

@Component({
  selector: 'app-person-basic-info',
  templateUrl: './person-basic-info.component.html',
  styleUrls: ['./person-basic-info.component.scss']
})
export class PersonBasicInfoComponent implements OnChanges {
  readonly ProjectRole = ProjectRole;

  @Input() user: UserProfile;

  available: boolean;

  constructor(private dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const user: UserProfile = changes.user.currentValue;
    this.available = user.available; // Store in component property to prevent unnecessary calculations
  }

  get localTime() {
    return DateTime.local().setZone(this.user.timeZone).toLocaleString(DateTime.TIME_SIMPLE);
  }

  trackUserRole(index: number, userRole: UserRole): string {
    return userRole.role;
  }

  trackOrganization(index: number, org: Organization): string {
    return org.id;
  }

  showRoleLocations(userRole: UserRole): void {
    PersonRoleLocationsDialogComponent.open(this.dialog, userRole);
  }

  showAvailability(): void {
    PersonAvailabilityDialogComponent.open(this.dialog, this.user);
  }
}
