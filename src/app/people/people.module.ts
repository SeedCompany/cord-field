import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleRoutingModule } from './people-routing.module';
import { PersonAboutComponent } from './person-details/person-about/person-about.component';
import { PersonAvailabilityDialogComponent } from './person-details/person-availability-dialog/person-availability-dialog.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import {
  PersonLocationsByRoleDialogComponent
} from './person-details/person-locations-by-role-dialog/person-locations-by-role-dialog.component';
import { PersonProfileComponent } from './person-details/person-profile/person-profile.component';

@NgModule({
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  declarations: [
    PeopleListComponent,
    PersonAboutComponent,
    PersonDetailsComponent,
    PersonProfileComponent,
    PersonAvailabilityDialogComponent,
    PersonLocationsByRoleDialogComponent
  ],
  entryComponents: [
    PersonLocationsByRoleDialogComponent,
    PersonAvailabilityDialogComponent
  ]
})
export class PeopleModule {
}
