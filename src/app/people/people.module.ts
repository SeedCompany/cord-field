import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PeopleRoutingModule } from './people-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  declarations: [
  ]
})
export class PeopleModule {
}
