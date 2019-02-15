import { NgModule } from '@angular/core';
import { ProjectsAndInternshipsModule } from '@app/projects-and-internships/projects-and-internships.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { EngagementProductsComponent } from './project-engagements/project-engagement/engagement-product/engagement-products.component';
import { ProjectEngagementComponent } from './project-engagements/project-engagement/project-engagement.component';
import { ProjectEngagementsComponent } from './project-engagements/project-engagements.component';
import { ProjectExtensionComponent } from './project-extensions/project-extension/project-extension.component';
import { ProjectExtensionsComponent } from './project-extensions/project-extensions.component';
import { CreateDirectoryDialogComponent } from './project-files/create-directory-dialog/create-directory-dialog.component';
import { FileBreadcrumbsComponent } from './project-files/file-breadcrumbs/file-breadcrumbs.component';
import { FileRenameDialogComponent } from './project-files/file-rename-dialog/file-rename-dialog.component';
import { OverwriteFileWarningComponent } from './project-files/overwrite-file-warning/overwrite-file-warning.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectFormsComponent } from './project-forms/project-forms.component';
import { ProjectLanguagesComponent } from './project-languages/project-languages.component';
import { ProjectListFilterComponent } from './project-list/project-list-filter/project-list-filter.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectOverviewSidebarComponent } from './project-overview-sidebar/project-overview-sidebar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ProjectTeamMemberRoleDialogComponent } from './project-team-member-role-dialog/project-team-member-role-dialog.component';
import { ProjectTeamMemberAddComponent } from './project-team/project-team-member-add/project-team-member-add.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { ProjectNameComponent } from './project/project-name/project-name.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsAndInternshipsModule,
    ProjectsRoutingModule,
  ],
  declarations: [
    CreateDirectoryDialogComponent,
    EngagementProductsComponent,
    FileBreadcrumbsComponent,
    FileRenameDialogComponent,
    OverwriteFileWarningComponent,
    ProjectBudgetComponent,
    ProjectComponent,
    ProjectExtensionComponent,
    ProjectExtensionsComponent,
    ProjectFilesComponent,
    ProjectFormsComponent,
    ProjectListComponent,
    ProjectListFilterComponent,
    ProjectNameComponent,
    ProjectOverviewComponent,
    ProjectOverviewSidebarComponent,
    ProjectEngagementsComponent,
    ProjectEngagementComponent,
    ProjectTeamComponent,
    ProjectTeamMemberAddComponent,
    ProjectTeamMemberRoleDialogComponent,
    ProjectUpdatesComponent,
    ProjectLanguagesComponent,
    ProjectStatusComponent,
  ],
  entryComponents: [
    CreateDirectoryDialogComponent,
    FileRenameDialogComponent,
    OverwriteFileWarningComponent,
    ProjectTeamMemberAddComponent,
    ProjectTeamMemberRoleDialogComponent,
  ],
})
export class ProjectsModule {
}
