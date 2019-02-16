import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { BudgetComponent } from './budget/budget.component';
import { LocationTimeframeComponent } from './location-timeframe/location-timeframe.component';
import { PartnershipsComponent } from './partnerships/partnerships.component';
import { ProposalAndFcRecommendationComponent } from './proposal-and-fc-recommendation/proposal-and-fc-recommendation.component';

const components = [
  BudgetComponent,
  LocationTimeframeComponent,
  PartnershipsComponent,
  ProposalAndFcRecommendationComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: components,
  exports: components,
})
export class ProjectsAndInternshipsModule {
}
