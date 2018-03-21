import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [
    WelcomeComponent,
    NotFoundPageComponent,
  ],
})
export class CoreModule {
}
