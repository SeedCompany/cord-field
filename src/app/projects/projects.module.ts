import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectCreateDialogComponent } from './project-create-dialog/project-create-dialog.component';
import { ProjectEngagementDetailsComponent } from './project-engagement-details/project-engagement-details.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectFormsComponent } from './project-forms/project-forms.component';
import { ProjectLanguagesComponent } from './project-languages/project-languages.component';
import { ProjectListFilterComponent } from './project-list/project-list-filter/project-list-filter.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectLocationTimeframeComponent } from './project-location-timeframe/project-location-timeframe.component';
import { ProjectOverviewSidebarComponent } from './project-overview-sidebar/project-overview-sidebar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectPartnershipsComponent } from './project-partnerships/project-partnerships.component';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectBudgetComponent,
    ProjectComponent,
    ProjectCreateDialogComponent,
    ProjectEngagementDetailsComponent,
    ProjectFilesComponent,
    ProjectFormsComponent,
    ProjectListComponent,
    ProjectListFilterComponent,
    ProjectLocationTimeframeComponent,
    ProjectOverviewComponent,
    ProjectOverviewSidebarComponent,
    ProjectPartnershipsComponent,
    ProjectPlanComponent,
    ProjectTeamComponent,
    ProjectUpdatesComponent,
    ProjectLanguagesComponent,
    ProjectLocationTimeframeComponent
  ],
  entryComponents: [
    ProjectCreateDialogComponent
  ]
})
export class ProjectsModule {
}
