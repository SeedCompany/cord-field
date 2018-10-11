import { NgModule } from '@angular/core';
import {
  PersonAvailabilityDialogComponent
} from '@app/people/person-details/person-availability-dialog/person-availability-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { PeopleListFilterComponent } from './people-list/people-list-filter/people-list-filter.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleRoutingModule } from './people-routing.module';
import { PersonAboutComponent } from './person-details/person-about/person-about.component';
import { PersonBasicInfoComponent } from './person-details/person-basic-info/person-basic-info.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { PersonRoleLocationsDialogComponent } from './person-details/person-role-locations-dialog/person-role-locations-dialog.component';
import {
  PersonAvailabilityCrudDialogComponent
} from './person-edit/person-availability-crud-dialog/person-availability-crud-dialog.component';
import { PersonEditAboutComponent } from './person-edit/person-edit-about/person-edit-about.component';
import { PersonChangePasswordComponent } from './person-edit/person-edit-account/person-change-password/person-change-password.component';
import { PersonEditAccountComponent } from './person-edit/person-edit-account/person-edit-account.component';
import { PersonEditAdminComponent } from './person-edit/person-edit-admin/person-edit-admin.component';
import { PersonEditBasicInfoComponent } from './person-edit/person-edit-basic-info/person-edit-basic-info.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonComponent } from './person/person.component';

@NgModule({
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  declarations: [
    PeopleListFilterComponent,
    PeopleListComponent,
    PersonAboutComponent,
    PersonAvailabilityDialogComponent,
    PersonBasicInfoComponent,
    PersonChangePasswordComponent,
    PersonComponent,
    PersonDetailsComponent,
    PersonEditComponent,
    PersonEditAboutComponent,
    PersonEditAccountComponent,
    PersonEditAdminComponent,
    PersonEditBasicInfoComponent,
    PersonRoleLocationsDialogComponent,
    PersonAvailabilityCrudDialogComponent
  ],
  entryComponents: [
    PersonAvailabilityDialogComponent,
    PersonRoleLocationsDialogComponent,
    PersonAvailabilityCrudDialogComponent
  ],
  exports: [
    PersonAvailabilityDialogComponent,
    PersonAvailabilityCrudDialogComponent
  ]
})
export class PeopleModule {
}
