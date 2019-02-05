import { Component, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Organization } from '@app/core/models/organization';
import { Role } from '@app/core/models/role';
import { UserFilter } from '@app/core/models/user';
import { filterValues, hasValue, TypedFormControl } from '@app/core/util';
import { TableViewFilters } from '@app/shared/components/table-view/table-filter.directive';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-people-list-filter',
  templateUrl: './people-list-filter.component.html',
  styleUrls: ['./people-list-filter.component.scss'],
})
export class PeopleListFilterComponent implements TableViewFilters<UserFilter> {

  form = this.formBuilder.group({
    organizations: [[]],
    isActive: [],
  });

  constructor(private formBuilder: FormBuilder) { }

  get roles(): TypedFormControl<Role[]> {
    return this.form.get('roles') as TypedFormControl<Role[]>;
  }

  get organizations(): TypedFormControl<Organization[]> {
    return this.form.get('organizations') as TypedFormControl<Organization[]>;
  }

  @Output() get filters(): Observable<UserFilter> {
    return this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        map(filters => filterValues(filters, hasValue)),
      );
  }

  onOrganizationRemoved(organization: Organization): void {
    this.organizations.setValue(this.organizations.value.filter((org) => org.id !== organization.id));
  }

  reset() {
    this.form.reset({
      organizations: [],
    });
  }
}
