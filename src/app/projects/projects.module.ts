import { NgModule } from '@angular/core';
import { ProjectsAndInternshipsModule } from '@app/projects-and-internships/projects-and-internships.module';
import { SharedModule } from '../shared/shared.module';
import { EngagementProductsComponent } from './project-engagements/project-engagement/engagement-product/engagement-products.component';
import { ProjectEngagementComponent } from './project-engagements/project-engagement/project-engagement.component';
import { ProjectEngagementsComponent } from './project-engagements/project-engagements.component';
import { ProjectExtensionComponent } from './project-extensions/project-extension/project-extension.component';
import { ProjectExtensionsComponent } from './project-extensions/project-extensions.component';
import { ProjectLanguagesComponent } from './project-languages/project-languages.component';
import { ProjectListFilterComponent } from './project-list/project-list-filter/project-list-filter.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectOverviewSidebarComponent } from './project-overview-sidebar/project-overview-sidebar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { ProjectNameComponent } from './project/project-name/project-name.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsAndInternshipsModule,
    ProjectsRoutingModule,
  ],
  declarations: [
    EngagementProductsComponent,
    ProjectComponent,
    ProjectExtensionComponent,
    ProjectExtensionsComponent,
    ProjectListComponent,
    ProjectListFilterComponent,
    ProjectNameComponent,
    ProjectOverviewComponent,
    ProjectOverviewSidebarComponent,
    ProjectEngagementsComponent,
    ProjectEngagementComponent,
    ProjectUpdatesComponent,
    ProjectLanguagesComponent,
    ProjectStatusComponent,
  ],
  entryComponents: [
  ],
})
export class ProjectsModule {
}
