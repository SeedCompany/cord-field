import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { InternshipsRoutingModule } from './internships-routing.module';

@NgModule({
  imports: [
    SharedModule,
    InternshipsRoutingModule,
  ],
  declarations: [
  ],
})
export class InternshipsModule {
}
