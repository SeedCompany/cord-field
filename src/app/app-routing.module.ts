import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { NotFoundPageComponent } from './core/not-found-page/not-found-page.component';
import { AuthenticationGuard } from './core/route-guards/authentication-guard';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {path: '', redirectTo: 'projects', pathMatch: 'full'},
      {path: 'languages', loadChildren: './languages/languages.module#LanguagesModule'},
      {path: 'organizations', loadChildren: './organizations/organizations.module#OrganizationsModule'},
      {path: 'people', loadChildren: './people/people.module#PeopleModule'},
      {path: 'projects', loadChildren: './projects/projects.module#ProjectsModule'},
      {path: 'tasks', loadChildren: './tasks/tasks.module#TasksModule'}
    ],
    canActivate: [AuthenticationGuard]
  },
  {path: 'login', loadChildren: './core/login/login.module#LoginModule'},
  {path: 'confirm-email', redirectTo: 'login/confirm-email'},
  {path: 'forgot-password', redirectTo: 'login/reset-password'},
  {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
