import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TitleAware } from '../../../core/decorators';
import { Location } from '../../../core/models/location';
import { Organization } from '../../../core/models/organization';
import { ProjectRole } from '../../../core/models/project-role';
import { Unavailability, UserProfile, UserRole } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-basic-info',
  templateUrl: './person-edit-basic-info.component.html',
  styleUrls: ['./person-edit-basic-info.component.scss']
})
@TitleAware('Edit Basic Info')
export class PersonEditBasicInfoComponent extends AbstractPersonComponent implements OnInit {
  user: UserProfile;
  form: FormGroup;
  userRoles: FormArray;
  readonly ProjectRole = ProjectRole;
  availableRoles: ProjectRole[] = [];
  userViewSub: Subscription = Subscription.EMPTY;
  submitting = false;

  private allRoles: ProjectRole[] = [
    ProjectRole.Consultant,
    ProjectRole.RegionalDirector,
    ProjectRole.AreaDirector,
    ProjectRole.Writer,
    ProjectRole.ConsultantManager,
    ProjectRole.LeadFinancialAnalyst,
    ProjectRole.FieldCoordinator
  ];

  constructor(userViewState: UserViewStateService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
    super(userViewState);
  }

  ngOnInit(): void {
    this.userRoles = this.formBuilder.array([]);
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      roles: this.userRoles,
      organizations: [[]],
      email: ['', [Validators.required, Validators.email!]],
      phone: ['', Validators.required]
    })
    ;

    this.userViewSub = this.userViewState.user
      .takeUntil(this.unsubscribe)
      .subscribe(user => {
        this.user = user;
        if (user.canEdit) {
          user.roles.forEach(userRole => {
            const role = this.formBuilder.group({
              role: userRole.role,
              locations: userRole.locations
            });
            this.userRoles.push(role);
          });
        }
        this.organizations.setValue(user.organizations);
        this.firstName.setValue(user.displayFirstName || user.firstName);
        this.lastName.setValue(user.displayLastName || user.lastName);
        this.phone.setValue(user.phone);
        this.email.setValue(user.email);
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

  get phone(): AbstractControl {
    return this.form.get('phone')!;
  }

  getLocations(index: number): AbstractControl {
    return this.userRoles.at(index).get('locations')!;
  }

  get roles(): AbstractControl {
    return this.form.get('roles')!;
  }

  get organizations(): AbstractControl {
    return this.form.get('organizations')!;
  }

  private createRole(): FormGroup {
    return this.formBuilder.group({
      role: [],
      locations: [[]]
    });
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

  onOrgSelected(org: Organization): void {
    this.organizations.setValue([...this.organizations.value, org]);
  }

  onOrgRemoved(org: Organization): void {
    this.organizations.setValue((this.organizations.value as Organization[]).filter(o => o.id !== org.id));
  }

  onLocationSelected(index: number, location: Location): void {
    this.getLocations(index).setValue([...this.getLocations(index).value, location]);
  }

  onLocationRemoved(index: number, location: Location): void {
    this.getLocations(index).setValue((this.getLocations(index).value as Location[]).filter(loc => loc.id !== location.id));
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByValue(index: number, value: Unavailability): string {
    return value.id;
  }

  update(): void {
    // update user profile here
  }

}
