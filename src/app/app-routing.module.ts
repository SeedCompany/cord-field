import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { NotFoundPageComponent } from './core/not-found-page/not-found-page.component';
import { AuthenticationGuard } from './core/route-guards/authentication-guard';
import { ProjectsModule } from './projects/projects.module';

// Load ProjectsModule directly instead of lazily, because it makes HMR a lot slower.
// A more permanent fix should be determined with CF2-258
export function loadProjects() {
  return ProjectsModule;
}

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {path: '', redirectTo: 'projects', pathMatch: 'full'},
      {path: 'languages', loadChildren: 'app/languages/languages.module#LanguagesModule'},
      {path: 'organizations', loadChildren: 'app/organizations/organizations.module#OrganizationsModule'},
      {path: 'projects', loadChildren: loadProjects},
      {path: 'tasks', loadChildren: 'app/tasks/tasks.module#TasksModule'}
    ],
    canActivate: [AuthenticationGuard]
  },
  {path: 'login', loadChildren: 'app/core/login/login.module#LoginModule'},
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
