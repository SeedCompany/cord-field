import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AutofocusDirective } from './directives/autofocus.directive';
import { HeaderSearchComponent } from './header-search/header-search.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
  ],
  declarations: [
    AutofocusDirective,
    WelcomeComponent,
    NotFoundPageComponent,
    HeaderComponent,
    HeaderSearchComponent,
  ],
})
export class CoreModule {
}
