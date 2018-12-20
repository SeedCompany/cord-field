import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { PersonEditAboutComponent } from './person-edit/person-edit-about/person-edit-about.component';
import { PersonEditAccountComponent } from './person-edit/person-edit-account/person-edit-account.component';
import { PersonEditAdminComponent } from './person-edit/person-edit-admin/person-edit-admin.component';
import { PersonEditBasicInfoComponent } from './person-edit/person-edit-basic-info/person-edit-basic-info.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonComponent } from './person/person.component';

const routes: Routes = [
  {path: '', component: PeopleListComponent, pathMatch: 'full'},
  {
    path: ':id',
    component: PersonComponent,
    children: [
      {path: '', component: PersonDetailsComponent, pathMatch: 'full'},
      {
        path: 'edit',
        component: PersonEditComponent,
        children: [
          {path: '', redirectTo: 'basic', pathMatch: 'full'},
          {path: 'basic', component: PersonEditBasicInfoComponent},
          {path: 'about', component: PersonEditAboutComponent},
          {path: 'account', component: PersonEditAccountComponent},
          {path: 'admin', component: PersonEditAdminComponent},
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule {
}
