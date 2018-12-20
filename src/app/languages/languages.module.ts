import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LanguageListFilterComponent } from './language-list/language-list-filter/language-list-filter.component';
import { LanguageListComponent } from './language-list/language-list.component';
import { LanguagesRoutingModule } from './languages-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LanguagesRoutingModule,
  ],
  declarations: [
    LanguageListComponent,
    LanguageListFilterComponent,
  ],
})
export class LanguagesModule {
}
