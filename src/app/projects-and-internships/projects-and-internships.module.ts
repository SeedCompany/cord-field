import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { LocationTimeframeComponent } from './location-timeframe/location-timeframe.component';

const components = [
  LocationTimeframeComponent,
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
