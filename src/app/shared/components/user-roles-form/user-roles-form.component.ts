import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Location } from '../../../core/models/location';
import { ProjectRole } from '../../../core/models/project-role';
import { UserRole } from '../../../core/models/user';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { AutocompleteLocationComponent } from '../autocomplete/autocomplete-location.component';
import { SubscriptionComponent } from '../subscription.component';

@Component({
  selector: 'app-user-roles-form',
  templateUrl: './user-roles-form.component.html',
  styleUrls: ['./user-roles-form.component.scss']
})
export class UserRolesFormComponent extends SubscriptionComponent implements OnInit {

  readonly ProjectRole = ProjectRole;

  @Input() disabled = false;
  @Output() formReady = new EventEmitter<FormArray>();

  userRolesCtl = new FormArray([]);
  availableRoles: ProjectRole[] = [];
  adding = false;
  loadingRoles = true;
  private authorizedRoles: ProjectRole[];

  @ViewChildren(MatSelect) roleFields: QueryList<MatSelect>;
  @ViewChildren(AutocompleteLocationComponent) locationFields: QueryList<AutocompleteLocationComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    super();
  }

  get isPanelOpen() {
    if (this.roleFields.some(select => select.panelOpen)) {
      return true;
    }
    return this.locationFields.some(autocomplete => autocomplete.panelOpen);
  }

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    this.authorizedRoles = user ? await this.userService.getAssignableRolesForUser(user) : [];
    this.loadingRoles = false;

    this.userRolesCtl.valueChanges
      .takeUntil(this.unsubscribe)
      .subscribe((userRoles: UserRole[]) => {
        this.availableRoles = this.authorizedRoles
          .filter(role => !userRoles.find(userRole => userRole.role === role))
          .sort();
      });

    this.formReady.emit(this.userRolesCtl);
  }

  add(): void {
    if (this.loadingRoles) {
      return;
    }

    const roleCtl = new FormControl(null, Validators.required);
    const locationCtl = new FormControl([]);
    const userRoleCtl = new FormGroup({
      role: roleCtl,
      locations: locationCtl
    });

    const valChanges = roleCtl.valueChanges.subscribe((role: ProjectRole) => {
      const locationRequired = ProjectRole.needsLocations.includes(role);
      locationCtl.setValidators(locationRequired ? Validators.required : null);
      locationCtl.reset([]);
    });
    roleCtl.valueChanges.filter(val => !val).first().subscribe(() => {
      valChanges.unsubscribe();
      const index = this.userRolesCtl.controls.indexOf(userRoleCtl);
      this.userRolesCtl.removeAt(index);
    });

    this.userRolesCtl.push(userRoleCtl);
    this.adding = true;

    // Wait for element to render
    setTimeout(() => {
      const select = this.roleFields.last;

      // When closed for the first time:
      select.openedChange.filter(i => !i).first().subscribe(() => {
        this.adding = false;

        // If a value is not selected, then remove the control and reset the adding flag
        if (!select.value) {
          this.userRolesCtl.removeAt(this.roleFields.length - 1);
          return;
        }

        // Else role is valid, if it needs locations focus that
        if (ProjectRole.needsLocations.includes(select.value)) {
          this.locationFields.last.focus();
          return;
        }
      });

      // Open and focus newly created role select field
      select.open();
      select.focus();
    });
  }

  onLocationSelected(userRole: AbstractControl, location: Location): void {
    const control = userRole.get('locations')!;
    control.setValue([...control.value, location]);
  }

  onLocationRemoved(userRole: AbstractControl, location: Location): void {
    const control = userRole.get('locations')!;
    const list = control.value as Location[];
    control.setValue(list.filter(loc => loc.id !== location.id));
  }

  trackUserRoleControl(index: number, control: FormGroup) {
    return control.value.role;
  }
}
