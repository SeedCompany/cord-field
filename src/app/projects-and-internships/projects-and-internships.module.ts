import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { BudgetComponent } from './budget/budget.component';
import { LocationTimeframeComponent } from './location-timeframe/location-timeframe.component';
import { PartnershipsComponent } from './partnerships/partnerships.component';
import { ProposalAndFcRecommendationComponent } from './proposal-and-fc-recommendation/proposal-and-fc-recommendation.component';
import { TeamMemberAddComponent } from './team/team-member-add/team-member-add.component';
import { TeamMemberRoleDialogComponent } from './team/team-member-role-dialog/team-member-role-dialog.component';
import { TeamComponent } from './team/team.component';

const components = [
  BudgetComponent,
  LocationTimeframeComponent,
  PartnershipsComponent,
  ProposalAndFcRecommendationComponent,
  TeamComponent,
  TeamMemberAddComponent,
  TeamMemberRoleDialogComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: components,
  exports: components,
  entryComponents: [
    TeamMemberAddComponent,
    TeamMemberRoleDialogComponent,
  ],
})
export class ProjectsAndInternshipsModule {
}
