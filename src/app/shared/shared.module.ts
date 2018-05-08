import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { MaterialModule } from '../material.module';
import { AutocompleteLanguageComponent } from './components/autocomplete/autocomplete-language.component';
import { AutocompleteLocationComponent } from './components/autocomplete/autocomplete-location.component';
import { AutocompleteOrganizationComponent } from './components/autocomplete/autocomplete-organization.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AvatarLetterComponent } from './components/avatar-letter/avatar-letter.component';
import { SearchComponent } from './components/search/search.component';
import { SpeedDialItemComponent } from './components/speed-dial-item/speed-dial-item.component';
import { SpeedDialComponent } from './components/speed-dial/speed-dial.component';
import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SatPopoverModule
  ],
  exports: [
    AutocompleteLanguageComponent,
    AutocompleteLocationComponent,
    AutocompleteOrganizationComponent,
    AutocompleteComponent,
    AvatarLetterComponent,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SearchComponent,
    SpeedDialComponent,
    SpeedDialItemComponent
  ],
  declarations: [
    AutocompleteLanguageComponent,
    AutocompleteLocationComponent,
    AutocompleteOrganizationComponent,
    AutocompleteComponent,
    AutofocusDirective,
    AvatarLetterComponent,
    SearchComponent,
    SpeedDialComponent,
    SpeedDialItemComponent
  ]
})
export class SharedModule {
}
