import { Component, Inject, OnDestroy, OnInit, Optional, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { AbstractValueAccessor, ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { Location } from '@app/core/models/location';
import { Role } from '@app/core/models/role';
import { UserRole } from '@app/core/models/user';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UserService } from '@app/core/services/user.service';
import { enableControl, filterRequired } from '@app/core/util';
import { UserViewStateService } from '@app/people/user-view-state.service';
import { AutocompleteLocationComponent } from '@app/shared/components/autocomplete/autocomplete-location.component';
import { combineLatest, from as observableFrom, merge, Observable, of as observableOf } from 'rxjs';
import { delay, filter, first, map, mapTo, mergeMap, pairwise, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-roles-form',
  templateUrl: './user-roles-form.component.html',
  styleUrls: ['./user-roles-form.component.scss'],
  providers: [
    ValueAccessorProvider(UserRolesFormComponent),
  ],
})
export class UserRolesFormComponent extends AbstractValueAccessor<UserRole[]> implements OnInit, OnDestroy {

  readonly Role = Role;

  userRolesCtl = new FormArray([]);
  availableRoles: Role[] = [];
  adding = false;
  loadingRoles = true;
  disabled = false;

  @ViewChildren(MatSelect) roleFields: QueryList<MatSelect>;
  @ViewChildren(AutocompleteLocationComponent) locationFields: QueryList<AutocompleteLocationComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    @Inject(UserViewStateService) @Optional() private viewState: UserViewStateService | null,
  ) {
    super();
  }

  ngOnInit(): void {
    const authorizedRoles$ = observableFrom(this.authService.getCurrentUser())
      .pipe(
        switchMap(user => user ? this.userService.getAssignableRolesForUser(user) : observableOf([])),
      );

    combineLatest(
      this.externalChanges,
      authorizedRoles$,
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([userRoles, authorizedRoles]) => {
        this.availableRoles = authorizedRoles
          .filter(role => !userRoles.find(userRole => userRole.role === role))
          .sort();
        this.loadingRoles = false;
      });

    this.externalChanges
      .subscribe(roles => {
        while (this.userRolesCtl.length !== 0) {
          this.userRolesCtl.removeAt(0);
        }
        for (const role of roles) {
          this.userRolesCtl.push(this.createControl(role));
        }
      });
  }

  createControl({ role, locations }: { role: Role | null, locations: Location[] }) {
    const roleCtl = new FormControl(role, Validators.required);
    const locationCtl = new FormControl(locations);
    const userRoleCtl = new FormGroup({
      role: roleCtl,
      locations: locationCtl,
    });

    const remove = roleCtl.valueChanges
      .pipe(
        startWith(role), // Start with initial value (needed so pairwise has a starting point)
        pairwise(), // Group previous and current values
        filter(([previous, current]) => !current), // Continue if current value is empty meaning to remove
        map(([previous]) => previous), // Continue with previous value which is the value to remove
        first(), // After remove is triggered we no longer need to watch this control
        takeUntil(this.unsubscribe),
      );
    remove.subscribe(roleToRemove => {
      if (this.viewState) {
        this.viewState.change({ roles: { remove: { role: roleToRemove, locations: [] } } });
      }
      this.value = this.value.filter(r => r.role !== roleToRemove);
      const index = this.userRolesCtl.controls.findIndex(control => control.value.role === roleToRemove);
      if (index >= 0) {
        this.userRolesCtl.removeAt(index);
      }
    });

    roleCtl.valueChanges
      .pipe(
        takeUntil(remove), // Take until control is removed
        takeUntil(this.unsubscribe), // or component is destroyed
      )
      .subscribe((newRole: Role) => {
        if (Role.needsLocations.includes(newRole)) {
          locationCtl.setValidators(Validators.required);
        } else {
          locationCtl.setValidators(null);
          locationCtl.reset([]);
        }
      });

    if (this.viewState) {
      roleCtl.valueChanges
        .pipe(
          takeUntil(remove), // Take until control is removed
          takeUntil(this.unsubscribe), // or component is destroyed
          startWith(role),
          filterRequired(), // not a removal
          pairwise(),
          filter(([oldRole, newRole]) => oldRole !== newRole), // Seems to happen during initialization
        )
        .subscribe(([oldRole, newRole]) => {
          this.viewState!.change({
            roles: {
              remove: { role: oldRole, locations: [] },
              add: { role: newRole, locations: Role.needsLocations.includes(newRole) ? locationCtl.value : [] },
            },
          });
        });
      locationCtl.valueChanges
        .pipe(
          takeUntil(remove), // Take until control is removed
          takeUntil(this.unsubscribe), // or component is destroyed
        )
        .subscribe(newLocations => {
          this.viewState!.change({
            roles: {
              update: { role: roleCtl.value, locations: newLocations },
            },
          });
        });
      userRoleCtl.statusChanges
        .pipe(
          takeUntil(remove), // Take until control is removed
          takeUntil(this.unsubscribe), // or component is destroyed
          filter(status => status === 'INVALID'),
        )
        .subscribe(() => {
          this.viewState!.revert('roles', { role: roleCtl.value, locations: [] });
        });
    }

    return userRoleCtl;
  }

  add(): void {
    if (this.loadingRoles) {
      return;
    }

    const userRoleCtl = this.createControl({ role: null, locations: [] });
    this.userRolesCtl.push(userRoleCtl);
    this.adding = true;

    // Grab last select field after elements have rendered
    const lastChildAfterRender = <T>(vc: QueryList<T>): Observable<T> => observableOf(true)
      .pipe(
        delay(0),
        map(() => vc.last),
      );

    const select$ = lastChildAfterRender(this.roleFields);

    // When closed for the first time
    const closed$ = select$.pipe(mergeMap(select => {
      return merge(
        select.openedChange.pipe(filter(i => !i)),
        select.selectionChange,
      )
        .pipe(
          first(),
          mapTo(select),
        );
    }));

    // Open and focus newly created role select field
    select$.subscribe(select => {
      select.open();
      select.focus();
    });

    // On role select close handle new role or remove form control
    closed$.subscribe(select => {
      this.adding = false;

      // If a value is not selected, then remove the control and reset the adding flag
      if (!select.value) {
        this.userRolesCtl.removeAt(this.roleFields.length - 1);
        return;
      }

      // Else role is valid, add to model
      this.value = [...this.value, { role: select.value, locations: [] }];

      // If the role needs locations focus that
      if (Role.needsLocations.includes(select.value)) {
        lastChildAfterRender(this.locationFields)
          .pipe(first())
          .subscribe(field => field.focus());
      }
    });
  }

  /**
   * Control already has the new location, but this.value does not.
   * This method fixes that. It probably should done differently but this is a quick fix.
   */
  onLocationAdded(userRoleControl: AbstractControl, location: Location | null) {
    if (!location) {
      return;
    }
    const role = userRoleControl.get('role')!.value as string;
    const control = userRoleControl.get('locations')!;
    const newList = [...control.value as Location[], location];
    this.value = this.value.map(userRole => {
      if (userRole.role !== role) {
        return userRole;
      }
      userRole.locations = newList;
      return userRole;
    });
  }

  onLocationRemoved(userRoleControl: AbstractControl, location: Location): void {
    const role = userRoleControl.get('role')!.value as string;
    const control = userRoleControl.get('locations')!;
    const list = control.value as Location[];
    const newList = list.filter(loc => loc.id !== location.id);
    control.setValue(newList);
    this.value = this.value.map(userRole => {
      if (userRole.role !== role) {
        return userRole;
      }
      userRole.locations = newList;
      return userRole;
    });
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    enableControl(this.userRolesCtl, !isDisabled);
  }

  trackUserRoleControl(index: number, control: FormGroup) {
    return control.value.role;
  }
}
