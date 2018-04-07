import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModule } from './core/login/login.module';
import { NotFoundPageComponent } from './core/not-found-page/not-found-page.component';
import { AuthenticationGuard } from './core/route-guards/authentication-guard';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { HeaderComponent } from './core/header/header.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {path: '', component: WelcomeComponent, pathMatch: 'full'},
      {path: 'languages', loadChildren: 'app/languages/languages.module#LanguagesModule'},
      {path: 'organizations', loadChildren: 'app/organizations/organizations.module#OrganizationsModule'},
      {path: 'projects', loadChildren: 'app/projects/projects.module#ProjectsModule'},
      {path: 'tasks', loadChildren: 'app/tasks/tasks.module#TasksModule'}
    ],
    canActivate: [AuthenticationGuard]
  },
  {path: 'login', loadChildren: () => LoginModule},
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
