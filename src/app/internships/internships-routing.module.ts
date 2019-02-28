import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirtyGuard } from '@app/core/route-guards/dirty.guard';
import { BudgetComponent } from '@app/projects-and-internships/budget/budget.component';
import { FilesComponent } from '@app/projects-and-internships/files/files.component';
import {
  ProposalAndFcRecommendationComponent,
} from '@app/projects-and-internships/proposal-and-fc-recommendation/proposal-and-fc-recommendation.component';
import { TeamComponent } from '@app/projects-and-internships/team/team.component';
import { InternshipEngagementComponent } from './internship-engagements/internship-engagement/internship-engagement.component';
import { InternshipEngagementsComponent } from './internship-engagements/internship-engagements.component';
import { InternshipListComponent } from './internship-list/internship-list.component';
import { InternshipOverviewComponent } from './internship-overview/internship-overview.component';
import { InternshipComponent } from './internship/internship.component';

const routes: Routes = [
  { path: '', component: InternshipListComponent, pathMatch: 'full' },
  {
    path: ':id',
    component: InternshipComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: InternshipOverviewComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard] },
      { path: 'forms', component: ProposalAndFcRecommendationComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard] },
      {
        path: 'engagements',
        component: InternshipEngagementsComponent,
        children: [
          { path: ':id', component: InternshipEngagementComponent, canDeactivate: [DirtyGuard] },
        ],
      },
      { path: 'budget', component: BudgetComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard] },
      { path: 'files', component: FilesComponent },
      { path: 'team', component: TeamComponent },
    ],
    canDeactivate: [DirtyGuard],
    canActivateChild: [DirtyGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternshipsRoutingModule {
}
