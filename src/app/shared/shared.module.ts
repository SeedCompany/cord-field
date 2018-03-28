import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    AutofocusDirective
  ]
})
export class SharedModule {
}
