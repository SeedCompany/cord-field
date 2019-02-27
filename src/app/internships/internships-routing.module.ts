import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirtyGuard } from '@app/core/route-guards/dirty.guard';
import { NotImplementedGuard } from '@app/core/route-guards/not-implemented.guard';
import { BudgetComponent } from '@app/projects-and-internships/budget/budget.component';
import { FilesComponent } from '@app/projects-and-internships/files/files.component';
import {
  ProposalAndFcRecommendationComponent,
} from '@app/projects-and-internships/proposal-and-fc-recommendation/proposal-and-fc-recommendation.component';
import { TeamComponent } from '@app/projects-and-internships/team/team.component';
import { InternshipOverviewComponent } from './internship-overview/internship-overview.component';
import { InternshipComponent } from './internship/internship.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [NotImplementedGuard] },
  {
    path: ':id',
    component: InternshipComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: InternshipOverviewComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard] },
      { path: 'forms', component: ProposalAndFcRecommendationComponent, data: { acceptDirty: true }, canDeactivate: [DirtyGuard] },
      {
        path: 'engagements',
        children: [
          { path: ':id', canDeactivate: [DirtyGuard], canActivate: [NotImplementedGuard] },
        ],
        canActivate: [NotImplementedGuard],
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
