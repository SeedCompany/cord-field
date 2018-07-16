import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { PersonComponent } from './person/person.component';

const routes: Routes = [
  {path: '', component: PeopleListComponent, pathMatch: 'full'},
  {
    path: ':id',
    component: PersonComponent,
    children: [
      {path: '', component: PersonDetailsComponent, pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule {
}
