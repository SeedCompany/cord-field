import { Component, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Organization } from '@app/core/models/organization';
import { ProjectRole } from '@app/core/models/project-role';
import { UserFilter } from '@app/core/models/user';
import { filterEntries, hasValue, TypedFormControl } from '@app/core/util';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-people-list-filter',
  templateUrl: './people-list-filter.component.html',
  styleUrls: ['./people-list-filter.component.scss'],
})
export class PeopleListFilterComponent {

  form = this.formBuilder.group({
    organizations: [[]],
    isActive: [],
  });

  constructor(private formBuilder: FormBuilder) { }

  get roles(): TypedFormControl<ProjectRole[]> {
    return this.form.get('roles') as TypedFormControl<ProjectRole[]>;
  }

  get organizations(): TypedFormControl<Organization[]> {
    return this.form.get('organizations') as TypedFormControl<Organization[]>;
  }

  @Output() get filters(): Observable<UserFilter> {
    return this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        map(filters =>
          filterEntries(filters, (key, value) => hasValue(value)),
        ),
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
