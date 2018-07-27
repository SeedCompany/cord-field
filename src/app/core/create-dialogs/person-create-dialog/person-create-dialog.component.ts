import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UserRolesFormComponent } from '../../../shared/components/user-roles-form/user-roles-form.component';
import { UserService } from '../../services/user.service';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'app-person-create-dialog',
  templateUrl: './person-create-dialog.component.html',
  styleUrls: ['./person-create-dialog.component.scss']
})
export class PersonCreateDialogComponent implements OnInit {

  form: FormGroup;

  @ViewChild(UserRolesFormComponent) userRoles: UserRolesFormComponent;

  static open(dialog: MatDialog) {
    return dialog.open(PersonCreateDialogComponent, {
      width: '500px',
      disableClose: true
    });
  }

  constructor(private dialogRef: MatDialogRef<PersonCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private userService: UserService) {
  }

  async ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', CustomValidators.email],
      sendInvite: [false]
    });

    this.dialogRef.backdropClick().subscribe(() => this.onEscKey());
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

  @HostListener('keyup.enter') onEnterKey() {
    if (this.form.valid && !this.userRoles.isPanelOpen) {
      this.onCreate();
    }
  }

  @HostListener('keyup.esc') onEscKey() {
    if (!this.userRoles.isPanelOpen) {
      this.dialogRef.close();
    }
  }

  async onCreate() {
    this.form.disable();
    try {
      const userId = await this.userService.create(this.form.value);
      this.router.navigate(['/users', userId]);
      this.dialogRef.close();
      if (this.form.value.sendInvite) {
        this.snackBar.open('Invitation sent', undefined, {duration: 5000});
      }
    } catch (e) {
      this.snackBar.open('Failed to create person', undefined, {duration: 3000});
    } finally {
      this.form.enable();
    }
  }
}
