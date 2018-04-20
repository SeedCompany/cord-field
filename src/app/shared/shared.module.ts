import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { MaterialModule } from '../material.module';
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
    AutofocusDirective,
    AvatarLetterComponent,
    SearchComponent,
    SpeedDialComponent,
    SpeedDialItemComponent
  ]
})
export class SharedModule {
}
