import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectCreateDialogComponent } from './project-create-dialog/project-create-dialog.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectOverviewSidebarComponent } from './project-overview-sidebar/project-overview-sidebar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectPeopleComponent } from './project-people/project-people.component';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
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
    ProjectFilesComponent,
    ProjectListComponent,
    ProjectOverviewComponent,
    ProjectOverviewSidebarComponent,
    ProjectPeopleComponent,
    ProjectPlanComponent,
    ProjectUpdatesComponent
  ],
  entryComponents: [
    ProjectCreateDialogComponent
  ]
})
export class ProjectsModule {
}
