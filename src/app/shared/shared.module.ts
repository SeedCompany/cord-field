import { CommonModule, DecimalPipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DisplayOrEditFieldComponent } from '@app/shared/components/display-or-edit-field/display-or-edit-field.component';
import { SatPopoverModule } from '@ncstate/sat-popover';

import { MaterialModule } from '../material.module';
import { AutocompleteLanguageComponent } from './components/autocomplete/autocomplete-language.component';
import { AutocompleteLocationComponent } from './components/autocomplete/autocomplete-location.component';
import { AutocompleteOrganizationComponent } from './components/autocomplete/autocomplete-organization.component';
import { AutocompleteUserComponent } from './components/autocomplete/autocomplete-user.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AvatarLetterComponent } from './components/avatar-letter/avatar-letter.component';
import { ButtonTextOrProgressComponent } from './components/button-text-or-progress/button-text-or-progress.component';
import { CollapsedChipListComponent } from './components/collapsed-chip-list/collapsed-chip-list.component';
import { SaveDiscardDialComponent } from './components/save-discard-dial/save-discard-dial.component';
import { SearchComponent } from './components/search/search.component';
import { SpeedDialItemComponent } from './components/speed-dial-item/speed-dial-item.component';
import { SpeedDialComponent } from './components/speed-dial/speed-dial.component';
import { StatusSelectWorkflowComponent } from './components/status-select-workflow/status-select-workflow.component';
import { TableFilterDirective } from './components/table-view/table-filter.directive';
import { TableViewComponent } from './components/table-view/table-view.component';
import { UniqueTextFieldComponent } from './components/unique-text-field/unique-text-field.component';
import { UserRolesFormComponent } from './components/user-roles-form/user-roles-form.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { NotImplementedDirective } from './directives/not-implemented.directive';
import { RedactableDirective } from './directives/redactable.directive';
import { LuxonDateAdapter, MAT_LUXON_DATE_FORMATS } from './luxon-date-adapter';
import { FileSizePipe } from './pipes/file-size.pipe';
import { LanguageInfoPipe } from './pipes/language-info.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SatPopoverModule,
  ],
  exports: [
    AutocompleteLanguageComponent,
    AutocompleteLocationComponent,
    AutocompleteOrganizationComponent,
    AutocompleteUserComponent,
    AutocompleteComponent,
    AutofocusDirective,
    AvatarLetterComponent,
    ButtonTextOrProgressComponent,
    CollapsedChipListComponent,
    CommonModule,
    DisplayOrEditFieldComponent,
    FileSizePipe,
    FormsModule,
    LanguageInfoPipe,
    MaterialModule,
    NotImplementedDirective,
    ReactiveFormsModule,
    RedactableDirective,
    SaveDiscardDialComponent,
    SearchComponent,
    SpeedDialComponent,
    SpeedDialItemComponent,
    StatusSelectWorkflowComponent,
    TableFilterDirective,
    TableViewComponent,
    UniqueTextFieldComponent,
    UserRolesFormComponent,
  ],
  declarations: [
    AutocompleteLanguageComponent,
    AutocompleteLocationComponent,
    AutocompleteOrganizationComponent,
    AutocompleteUserComponent,
    AutocompleteComponent,
    AutofocusDirective,
    AvatarLetterComponent,
    ButtonTextOrProgressComponent,
    CollapsedChipListComponent,
    DisplayOrEditFieldComponent,
    FileSizePipe,
    LanguageInfoPipe,
    NotImplementedDirective,
    RedactableDirective,
    SaveDiscardDialComponent,
    SearchComponent,
    SpeedDialComponent,
    SpeedDialItemComponent,
    StatusSelectWorkflowComponent,
    TableFilterDirective,
    TableViewComponent,
    UniqueTextFieldComponent,
    UserRolesFormComponent,
  ],
  providers: [
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS },
    { provide: DateAdapter, useClass: LuxonDateAdapter },
  ],
})
export class SharedModule {
}
