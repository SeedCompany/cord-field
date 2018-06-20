import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleRoutingModule } from './people-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  declarations: [
    PeopleListComponent
  ]
})
export class PeopleModule {
}
