import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Location } from '../../../core/models/location';
import { Role } from '../../../core/models/role';
import { UserRole } from '../../../core/models/user';

@Component({
  selector: 'app-person-locations-by-role-dialog',
  templateUrl: './person-role-locations-dialog.component.html',
  styleUrls: ['./person-role-locations-dialog.component.scss'],
})
export class PersonRoleLocationsDialogComponent {
  readonly Role = Role;

  role: Role;
  locations: Location[];

  static open(dialog: MatDialog, userRole: UserRole) {
    return dialog.open(this, {
      width: '40vw',
      minWidth: '400px',
      autoFocus: false,
      data: userRole,
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) {role, locations}: UserRole) {
    this.role = role;
    this.locations = locations;
  }

  trackLocation(index: number, location: Location): string {
    return location.id;
  }
}
