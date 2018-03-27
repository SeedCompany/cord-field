import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProjectListSearchComponent } from './project-list-search/project-list-search.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectSearchService } from './project-search.service';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectListComponent,
    ProjectListSearchComponent
  ],
  providers: [
    ProjectSearchService
  ]
})
export class ProjectsModule {
}
