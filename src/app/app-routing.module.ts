import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/not-found-page/not-found-page.component';
import { WelcomeComponent } from './core/welcome/welcome.component';

const routes: Routes = [
  {path: 'login', loadChildren: 'app/core/login/login.module#LoginModule'},
  {path: 'welcome', component: WelcomeComponent, pathMatch: 'full'},
  {path: 'languages', loadChildren: 'app/languages/languages.module#LanguagesModule'},
  {path: 'organizations', loadChildren: 'app/organizations/organizations.module#OrganizationsModule'},
  {path: 'projects', loadChildren: 'app/projects/projects.module#ProjectsModule'},
  {path: 'tasks', loadChildren: 'app/tasks/tasks.module#TasksModule'},
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
