import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProjectRole } from '../../../core/models/project-role';
import { UserRole } from '../../../core/models/user';

@Component({
  selector: 'app-person-locations-by-role-dialog',
  templateUrl: './person-locations-by-role-dialog.component.html',
  styleUrls: ['./person-locations-by-role-dialog.component.scss']
})
export class PersonLocationsByRoleDialogComponent implements OnInit {
  readonly ProjectRole = ProjectRole;

  constructor(private dialogRef: MatDialogRef<PersonLocationsByRoleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: UserRole) {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }
}
