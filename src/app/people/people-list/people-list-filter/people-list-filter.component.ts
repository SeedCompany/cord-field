import { Component, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../../core/models/organization';
import { ProjectRole } from '../../../core/models/project-role';
import { UserFilter } from '../../../core/models/user';
import { TypedFormControl } from '../../../core/util';

@Component({
  selector: 'app-people-list-filter',
  templateUrl: './people-list-filter.component.html',
  styleUrls: ['./people-list-filter.component.scss']
})
export class PeopleListFilterComponent {

  form = this.formBuilder.group({
    organizations: [[]],
    isActive: []
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
      .startWith(this.form.value)
      .map(filters => {
        const result: any = {};
        for (const [key, value] of Object.entries(filters)) {
          if (value == null) {
            continue;
          }
          if (Array.isArray(value)) {
            if (value.length === 0) {
              continue;
            }
          }

          result[key] = value;
        }

        return result;
      });
  }

  onOrganizationSelected(org: Organization): void {
    this.organizations.setValue([...this.organizations.value, org]);
  }

  onOrganizationRemoved(organization: Organization): void {
    this.organizations.setValue(this.organizations.value.filter(org => org.id !== organization.id));
  }

  reset() {
    this.form.reset({
      organizations: []
    });
  }
}
