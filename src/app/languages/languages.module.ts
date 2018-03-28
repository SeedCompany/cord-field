import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LanguagesRoutingModule } from './languages-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LanguagesRoutingModule
  ],
  declarations: []
})
export class LanguagesModule {
}
