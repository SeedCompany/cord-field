import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { MaterialModule } from '../material.module';
import { AutocompleteLanguageComponent } from './components/autocomplete/autocomplete-language.component';
import { AutocompleteLocationComponent } from './components/autocomplete/autocomplete-location.component';
import { AutocompleteOrganizationComponent } from './components/autocomplete/autocomplete-organization.component';
import { AutocompleteUserComponent } from './components/autocomplete/autocomplete-user.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AvatarLetterComponent } from './components/avatar-letter/avatar-letter.component';
import { SearchComponent } from './components/search/search.component';
import { SpeedDialItemComponent } from './components/speed-dial-item/speed-dial-item.component';
import { SpeedDialComponent } from './components/speed-dial/speed-dial.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { LanguageInfoPipe } from './pipes/language-info.pipe';

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
    AutocompleteUserComponent,
    AutocompleteComponent,
    AvatarLetterComponent,
    CommonModule,
    FormsModule,
    LanguageInfoPipe,
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
    AutocompleteUserComponent,
    AutocompleteComponent,
    AutofocusDirective,
    AvatarLetterComponent,
    LanguageInfoPipe,
    SearchComponent,
    SpeedDialComponent,
    SpeedDialItemComponent
  ],
  providers: [
    DecimalPipe
  ]
})
export class SharedModule {
}
