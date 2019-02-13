import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { InternshipNameComponent } from './internship/internship-name/internship-name.component';
import { InternshipComponent } from './internship/internship.component';
import { InternshipsRoutingModule } from './internships-routing.module';

@NgModule({
  imports: [
    SharedModule,
    InternshipsRoutingModule,
  ],
  declarations: [
    InternshipComponent,
    InternshipNameComponent,
  ],
})
export class InternshipsModule {
}
