import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CustomValidators } from '../../models/custom-validators';
import { Location } from '../../models/location';
import { ProjectRole } from '../../models/project-role';
import { UserRole } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-person-create-dialog',
  templateUrl: './person-create-dialog.component.html',
  styleUrls: ['./person-create-dialog.component.scss']
})
export class PersonCreateDialogComponent implements OnInit {

  form: FormGroup;
  submitting = false;
  userRoles: FormArray;
  availableRoles: ProjectRole[] = [];

  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;
  private allRoles: ProjectRole[] = [
    ProjectRole.Consultant,
    ProjectRole.RegionalDirector,
    ProjectRole.AreaDirector,
    ProjectRole.Writer,
    ProjectRole.ConsultantManager,
    ProjectRole.LeadFinancialAnalyst,
    ProjectRole.FieldCoordinator
  ];
  readonly ProjectRole = ProjectRole;


  constructor(public dialogRef: MatDialogRef<PersonCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userRoles = this.formBuilder.array([]);
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', CustomValidators.email],
      roles: this.userRoles
    });
    this.roles.valueChanges.subscribe((userRoles: UserRole[]) => {
      this.availableRoles = this.allRoles
        .filter(role => !userRoles.find(userRole => userRole.role === role))
        .sort();
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

  getLocations(index: number): AbstractControl {
    return this.userRoles.at(index).get('locations')!;
  }

  get roles(): AbstractControl {
    return this.form.get('roles')!;
  }

  addRole(): void {
    this.userRoles.push(this.createRole());
  }

  getAvailableRoles(i: number): ProjectRole[] {
    const projectRoles = [...this.availableRoles];
    if (this.roles.value[i].role) {
      projectRoles.push(this.roles.value[i].role);
    }
    return projectRoles.sort();
  }

  private createRole(): FormGroup {
    return this.formBuilder.group({
      role: [],
      locations: [[]]
    });
  }

  onLocationSelected(index: number, location: Location): void {
    this.getLocations(index).setValue([...this.getLocations(index).value, location]);
  }

  onLocationRemoved(index: number, location: Location): void {
    this.getLocations(index).setValue((this.getLocations(index).value as Location[]).filter(loc => loc.id !== location.id));
  }

  async onCreate() {
    this.submitting = true;
    this.form.disable();
    try {
      this.form.value.roles = this.form.value.roles.filter((profile: UserRole) => !!profile.role);
      const user = await this.userService.createProfile(this.form.value);
    } catch (e) {
      this.showSnackBar('Failed to create user profile');
    } finally {
      this.submitting = false;
      this.dialogRef.close();
    }
  }

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
