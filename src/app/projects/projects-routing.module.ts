import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {path: '', component: ProjectListComponent, pathMatch: 'full'},
  {
    component: ProjectComponent,
    matcher: (segments: UrlSegment[]): UrlMatchResult => {
      const posParams = {
        id: segments[0],
      };
      if (segments.length === 2) {
        posParams['tab'] = segments[1];
      }

      return {consumed: segments, posParams};
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
