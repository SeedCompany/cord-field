import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OrganizationsRoutingModule } from './organizations-routing.module';

@NgModule({
  imports: [
    SharedModule,
    OrganizationsRoutingModule
  ],
  declarations: []
})
export class OrganizationsModule {
}
