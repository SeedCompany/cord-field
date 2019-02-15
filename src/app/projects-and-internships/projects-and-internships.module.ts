import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { LocationTimeframeComponent } from './location-timeframe/location-timeframe.component';
import { PartnershipsComponent } from './partnerships/partnerships.component';

const components = [
  LocationTimeframeComponent,
  PartnershipsComponent,
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
