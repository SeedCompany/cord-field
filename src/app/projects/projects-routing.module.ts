import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectPeopleComponent } from './project-people/project-people.component';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {path: '', component: ProjectListComponent, pathMatch: 'full'},
  {
    path: ':id',
    component: ProjectComponent,
    children: [
      {path: '', component: ProjectOverviewComponent, pathMatch: 'full'},
      {path: 'plan', component: ProjectPlanComponent},
      {path: 'budget', component: ProjectBudgetComponent},
      {path: 'files', component: ProjectFilesComponent},
      {path: 'people', component: ProjectPeopleComponent},
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
