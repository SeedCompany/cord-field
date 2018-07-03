import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Unavailability, UserProfile } from '../../../core/models/user';

@Component({
  selector: 'app-person-availability-dialog',
  templateUrl: './person-availability-dialog.component.html',
  styleUrls: ['./person-availability-dialog.component.scss']
})
export class PersonAvailabilityDialogComponent implements OnInit {
  comingUnavailableDates: Unavailability[] = [];
  pastUnavailableDates: Unavailability[] = [];

  constructor(private dialogRef: MatDialogRef<PersonAvailabilityDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: UserProfile) {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.data.unavailabilities.forEach(unavailability => {
      if (this.isPastDate(unavailability)) {
        this.pastUnavailableDates.push(unavailability);
      } else {
        this.comingUnavailableDates.push(unavailability);
      }
    });
  }

  private isPastDate(unavailability: Unavailability): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const unavailabilityDate = unavailability.end.toJSDate();
    unavailabilityDate.setHours(0, 0, 0, 0);
    return currentDate.getTime() > unavailabilityDate.getTime();
  }
}
