import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HeaderRouterOutletComponent } from './components/header-router-outlet/header-router-outlet.component';
import { SearchComponent } from './components/search/search.component';
import { AutofocusDirective } from './directives/autofocus.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SearchComponent,
    HeaderRouterOutletComponent
  ],
  declarations: [
    AutofocusDirective,
    SearchComponent,
    HeaderRouterOutletComponent
  ]
})
export class SharedModule {
}
