import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleRoutingModule } from './people-routing.module';
import { PersonAboutComponent } from './person-details/person-about/person-about.component';
import { PersonAvailabilityDialogComponent } from './person-details/person-availability-dialog/person-availability-dialog.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { PersonProfileComponent } from './person-details/person-profile/person-profile.component';
import { PersonRoleLocationsDialogComponent } from './person-details/person-role-locations-dialog/person-role-locations-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  declarations: [
    PeopleListComponent,
    PersonAboutComponent,
    PersonAvailabilityDialogComponent,
    PersonDetailsComponent,
    PersonProfileComponent,
    PersonRoleLocationsDialogComponent
  ],
  entryComponents: [
    PersonAvailabilityDialogComponent,
    PersonRoleLocationsDialogComponent
  ]
})
export class PeopleModule {
}
