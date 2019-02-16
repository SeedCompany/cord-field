import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirtyGuard } from '@app/core/route-guards/dirty.guard';
import {
  ProposalAndFcRecommendationComponent,
} from '@app/projects-and-internships/proposal-and-fc-recommendation/proposal-and-fc-recommendation.component';
import { ProjectExtensionComponent } from '@app/projects/project-extensions/project-extension/project-extension.component';
import { ProjectExtensionsComponent } from '@app/projects/project-extensions/project-extensions.component';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectEngagementComponent } from './project-engagements/project-engagement/project-engagement.component';
import { ProjectEngagementsComponent } from './project-engagements/project-engagements.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
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
      {path: 'overview', component: ProjectOverviewComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard]},
      {path: 'forms', component: ProposalAndFcRecommendationComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard]},
      {
        path: 'engagements',
        component: ProjectEngagementsComponent,
        children: [
          { path: ':id', component: ProjectEngagementComponent, canDeactivate: [DirtyGuard]},
        ],
      },
      {path: 'budget', component: ProjectBudgetComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard]},
      {path: 'files', component: ProjectFilesComponent},
      {path: 'team', component: ProjectTeamComponent},
      {
        path: 'extensions',
        component: ProjectExtensionsComponent,
        children: [
          { path: ':id', component: ProjectExtensionComponent },
        ],
      },
      {path: 'updates', component: ProjectUpdatesComponent},
    ],
    canDeactivate: [DirtyGuard],
    canActivateChild: [DirtyGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {
}
