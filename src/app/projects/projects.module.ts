import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProjectCreateDialogComponent } from './project-create-dialog/project-create-dialog.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectCreateDialogComponent,
    ProjectListComponent
  ],
  entryComponents: [
    ProjectCreateDialogComponent
  ]
})
export class ProjectsModule {
}
