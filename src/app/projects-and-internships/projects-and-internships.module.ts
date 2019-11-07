import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeleteFileWarningComponent } from '@app/projects-and-internships/files/delete-file-warning/delete-file-warning.component';
import { SharedModule } from '@app/shared/shared.module';
import { BudgetComponent } from './budget/budget.component';
import { CreateDirectoryDialogComponent } from './files/create-directory-dialog/create-directory-dialog.component';
import { FileBreadcrumbsComponent } from './files/file-breadcrumbs/file-breadcrumbs.component';
import { FileRenameDialogComponent } from './files/file-rename-dialog/file-rename-dialog.component';
import { FilesComponent } from './files/files.component';
import { OverwriteFileWarningComponent } from './files/overwrite-file-warning/overwrite-file-warning.component';
import { LocationTimeframeComponent } from './location-timeframe/location-timeframe.component';
import { PartnershipsComponent } from './partnerships/partnerships.component';
import { ProposalAndFcRecommendationComponent } from './proposal-and-fc-recommendation/proposal-and-fc-recommendation.component';
import { TeamMemberAddComponent } from './team/team-member-add/team-member-add.component';
import { TeamMemberRoleDialogComponent } from './team/team-member-role-dialog/team-member-role-dialog.component';
import { TeamComponent } from './team/team.component';

const components = [
  BudgetComponent,
  CreateDirectoryDialogComponent,
  DeleteFileWarningComponent,
  FileBreadcrumbsComponent,
  FileRenameDialogComponent,
  FilesComponent,
  LocationTimeframeComponent,
  OverwriteFileWarningComponent,
  PartnershipsComponent,
  ProposalAndFcRecommendationComponent,
  TeamComponent,
  TeamMemberAddComponent,
  TeamMemberRoleDialogComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: components,
  exports: components,
  entryComponents: [
    CreateDirectoryDialogComponent,
    DeleteFileWarningComponent,
    FileRenameDialogComponent,
    OverwriteFileWarningComponent,
    TeamMemberAddComponent,
    TeamMemberRoleDialogComponent,
  ],
})
export class ProjectsAndInternshipsModule {
}
