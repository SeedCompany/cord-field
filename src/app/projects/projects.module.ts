import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProjectBudgetComponent } from './project-budget/project-budget.component';
import { ProjectEngagementDetailsComponent } from './project-engagement-details/project-engagement-details.component';
import { CreateDirectoryDialogComponent } from './project-files/create-directory-dialog/create-directory-dialog.component';
import { FileBreadcrumbsComponent } from './project-files/file-breadcrumbs/file-breadcrumbs.component';
import { FileRenameDialogComponent } from './project-files/file-rename-dialog/file-rename-dialog.component';
import { OverwriteFileWarningComponent } from './project-files/overwrite-file-warning/overwrite-file-warning.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectFormsComponent } from './project-forms/project-forms.component';
import { ProjectLanguagesComponent } from './project-languages/project-languages.component';
import { ProjectListFilterComponent } from './project-list/project-list-filter/project-list-filter.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectLocationTimeframeComponent } from './project-location-timeframe/project-location-timeframe.component';
import { ProjectOverviewSidebarComponent } from './project-overview-sidebar/project-overview-sidebar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectPartnershipsComponent } from './project-partnerships/project-partnerships.component';
import {
  ProjectPlanLanguageEngagementComponent
} from './project-plan/project-plan-language-engagement/project-plan-language-engagement.component';
import { ProjectPlanSidebarComponent } from './project-plan/project-plan-sidebar/project-plan-sidebar.component';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ProjectTeamMemberRoleDialogComponent } from './project-team-member-role-dialog/project-team-member-role-dialog.component';
import { ProjectTeamMemberAddComponent } from './project-team/project-team-member-add/project-team-member-add.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule
  ],
  declarations: [
    CreateDirectoryDialogComponent,
    FileBreadcrumbsComponent,
    FileRenameDialogComponent,
    OverwriteFileWarningComponent,
    ProjectBudgetComponent,
    ProjectComponent,
    ProjectEngagementDetailsComponent,
    ProjectFilesComponent,
    ProjectFormsComponent,
    ProjectListComponent,
    ProjectListFilterComponent,
    ProjectLocationTimeframeComponent,
    ProjectOverviewComponent,
    ProjectOverviewSidebarComponent,
    ProjectPartnershipsComponent,
    ProjectPlanComponent,
    ProjectTeamComponent,
    ProjectTeamMemberAddComponent,
    ProjectTeamMemberRoleDialogComponent,
    ProjectUpdatesComponent,
    ProjectLanguagesComponent,
    ProjectLocationTimeframeComponent,
    ProjectStatusComponent,
    ProjectLocationTimeframeComponent,
    ProjectPlanSidebarComponent,
    ProjectPlanLanguageEngagementComponent
  ],
  entryComponents: [
    CreateDirectoryDialogComponent,
    FileRenameDialogComponent,
    OverwriteFileWarningComponent,
    ProjectTeamMemberAddComponent,
    ProjectTeamMemberRoleDialogComponent
  ]
})
export class ProjectsModule {
}
