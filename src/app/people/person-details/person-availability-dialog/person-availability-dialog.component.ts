import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DateTime } from 'luxon';
import { Unavailability, UserProfile } from '../../../core/models/user';
import { sortBy } from '../../../core/util';

@Component({
  selector: 'app-person-availability-dialog',
  templateUrl: './person-availability-dialog.component.html',
  styleUrls: ['./person-availability-dialog.component.scss']
})
export class PersonAvailabilityDialogComponent {
  readonly format = DateTime.DATE_FULL;

  futureUnavailabilities: Unavailability[];
  pastUnavailabilities: Unavailability[];

  static open(dialog: MatDialog, user: UserProfile) {
    return dialog.open(this, {
      width: '40vw',
      minWidth: '400px',
      autoFocus: false,
      data: user
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public user: UserProfile) {
    const today = DateTime.utc();
    this.futureUnavailabilities = this.user.unavailabilities
      .filter(u => u.range.isAfter(today))
      .sort(sortBy(u => u.start));
    this.pastUnavailabilities = this.user.unavailabilities
      .filter(u => u.range.isBefore(today))
      .sort(sortBy(u => u.start, 'desc'));
  }

  trackUnavailability(index: number, unavailability: Unavailability): string {
    return unavailability.id;
  }
}
