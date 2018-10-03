import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectEngagementDetailsComponent } from './project-engagement-details/project-engagement-details.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectFormsComponent } from './project-forms/project-forms.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {path: '', component: ProjectListComponent, pathMatch: 'full'},
  {
    path: ':id',
    component: ProjectComponent,
    children: [
      {path: '', redirectTo: 'overview', pathMatch: 'full'},
      {
        path: 'overview',
        component: ProjectOverviewComponent,
        children: [
          {path: '', component: ProjectEngagementDetailsComponent, pathMatch: 'full'},
          {path: 'forms', component: ProjectFormsComponent}
        ]
      },
      {path: 'forms', component: ProjectFormsComponent},
      {path: 'plan', component: ProjectPlanComponent},
      {path: 'budget', component: ProjectBudgetComponent},
      {path: 'files', component: ProjectFilesComponent},
      {path: 'team', component: ProjectTeamComponent},
      {path: 'updates', component: ProjectUpdatesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
