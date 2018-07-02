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
    this.pastUnavailableDates = this.data.unavailabilities.filter(unavailability => this.pastDate(unavailability));
  }

  pastDate(unavailability: Unavailability): boolean {
    return true;
  }
}
