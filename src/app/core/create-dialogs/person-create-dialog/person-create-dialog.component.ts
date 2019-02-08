import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import * as CustomValidators from '@app/core/validators';

@Component({
  selector: 'app-person-create-dialog',
  templateUrl: './person-create-dialog.component.html',
  styleUrls: ['./person-create-dialog.component.scss'],
})
export class PersonCreateDialogComponent {
  form: FormGroup;
  submitting = false;

  static open(dialog: MatDialog): MatDialogRef<PersonCreateDialogComponent, any> {
    return dialog.open(PersonCreateDialogComponent, {
      width: '500px',
    });
  }

  constructor(
    private dialogRef: MatDialogRef<PersonCreateDialogComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService) {

    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', CustomValidators.email],
      userRoles: [[]],
      sendInvite: [false],
    });
  }

  get firstName(): AbstractControl {
    return this.form.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.form.get('lastName')!;
  }

  get email(): AbstractControl {
    return this.form.get('email')!;
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.form.valid) {
        this.submitting = true;

        const userId = await this.userService.create(this.form.value);

        this.router.navigate(['/people', userId]);
        this.dialogRef.close();

        if (this.form.value.sendInvite) {
          this.snackBar.open('Invitation sent', undefined, { duration: 5000 });
        }
      }
    } catch (e) {
      this.submitting = false;

      if (e instanceof HttpErrorResponse && e.status === 409) {
        this.email.setErrors({ inUse: true });
      } else {
        this.snackBar.open('Failed to create person', undefined, { duration: 3000 });
      }
    }
  }
}
