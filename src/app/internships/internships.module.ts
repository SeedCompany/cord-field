import { NgModule } from '@angular/core';
import { ProjectsAndInternshipsModule } from '@app/projects-and-internships/projects-and-internships.module';
import { SharedModule } from '@app/shared/shared.module';
import { InternshipListFilterComponent } from './internship-list/internship-list-filter/internship-list-filter.component';
import { InternshipListComponent } from './internship-list/internship-list.component';
import { InternshipInternsComponent } from './internship-overview/internship-interns/internship-interns.component';
import {
  InternshipOverviewSidebarComponent,
} from './internship-overview/internship-overview-sidebar/internship-overview-sidebar.component';
import { InternshipOverviewComponent } from './internship-overview/internship-overview.component';
import { InternshipNameComponent } from './internship/internship-name/internship-name.component';
import { InternshipComponent } from './internship/internship.component';
import { InternshipsRoutingModule } from './internships-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsAndInternshipsModule,
    InternshipsRoutingModule,
  ],
  declarations: [
    InternshipComponent,
    InternshipInternsComponent,
    InternshipNameComponent,
    InternshipListComponent,
    InternshipListFilterComponent,
    InternshipOverviewComponent,
    InternshipOverviewSidebarComponent,
  ],
})
export class InternshipsModule {
}
