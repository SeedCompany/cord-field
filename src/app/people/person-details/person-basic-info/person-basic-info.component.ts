import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Organization } from '@app/core/models/organization';
import { ProjectRole } from '@app/core/models/project-role';
import { UserProfile, UserRole } from '@app/core/models/user';
import { isRedacted } from '@app/core/util';
import { DateTime } from 'luxon';
import { PersonAvailabilityDialogComponent } from '../person-availability-dialog/person-availability-dialog.component';
import { PersonRoleLocationsDialogComponent } from '../person-role-locations-dialog/person-role-locations-dialog.component';

@Component({
  selector: 'app-person-basic-info',
  templateUrl: './person-basic-info.component.html',
  styleUrls: ['./person-basic-info.component.scss'],
})
export class PersonBasicInfoComponent implements OnChanges {
  readonly ProjectRole = ProjectRole;

  @Input() user: UserProfile;

  available: boolean;

  constructor(private dialog: MatDialog) {
  }

  get localTime() {
    return DateTime.local().setZone(this.user.timeZone).toLocaleString(DateTime.TIME_SIMPLE);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const user: UserProfile = changes.user.currentValue;
    this.available = user.available; // Store in component property to prevent unnecessary calculations
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

  isRedacted(value: string | null): boolean {
    return isRedacted(value) || !value;
  }
}
