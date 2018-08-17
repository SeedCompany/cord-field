import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LanguageListComponent } from './language-list/language-list.component';
import { LanguagesRoutingModule } from './languages-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LanguagesRoutingModule
  ],
  declarations: [
    LanguageListComponent
  ]
})
export class LanguagesModule {
}
