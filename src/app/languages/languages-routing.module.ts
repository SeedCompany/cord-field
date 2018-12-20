import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { notImplementedRoute } from '@app/core/route-guards/not-implemented.guard';
import { LanguageListComponent } from './language-list/language-list.component';

const routes: Routes = [
  {path: '', component: LanguageListComponent, pathMatch: 'full'},
  notImplementedRoute(':id', 'Language details view has not been implemented yet'),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LanguagesRoutingModule {
}
