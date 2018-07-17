import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleRoutingModule } from './people-routing.module';
import { PersonAboutComponent } from './person-details/person-about/person-about.component';
import { PersonAvailabilityDialogComponent } from './person-details/person-availability-dialog/person-availability-dialog.component';
import { PersonBasicInfoComponent } from './person-details/person-basic-info/person-basic-info.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { PersonRoleLocationsDialogComponent } from './person-details/person-role-locations-dialog/person-role-locations-dialog.component';
import { PersonEditAboutComponent } from './person-edit/person-edit-about/person-edit-about.component';
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
    PeopleListComponent,
    PersonAboutComponent,
    PersonAvailabilityDialogComponent,
    PersonBasicInfoComponent,
    PersonComponent,
    PersonDetailsComponent,
    PersonEditComponent,
    PersonEditAboutComponent,
    PersonEditAccountComponent,
    PersonEditAdminComponent,
    PersonEditBasicInfoComponent,
    PersonRoleLocationsDialogComponent
  ],
  entryComponents: [
    PersonAvailabilityDialogComponent,
    PersonRoleLocationsDialogComponent
  ]
})
export class PeopleModule {
}
