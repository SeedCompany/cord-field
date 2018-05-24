import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Project } from '../../core/models/project';
import { ProjectRole } from '../../core/models/project-role';
import { TeamMember } from '../../core/models/team-member';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-team-member-role-dialog',
  templateUrl: './project-team-member-role-dialog.component.html',
  styleUrls: ['./project-team-member-role-dialog.component.scss']
})
export class ProjectTeamMemberRoleDialogComponent implements OnInit {

  role: FormControl;
  readonly ProjectRole = ProjectRole;
  assignableRoles: ProjectRole[] = [];

  constructor(public projectTeamMemberRoleDialogRef: MatDialogRef<ProjectTeamMemberRoleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IProjectTeamMemberRoleDialog) {
  }

  ngOnInit() {
    this.role = new FormControl();
    if (this.data.project.location) {
      this.assignableRoles = this.data.teamMember.user.getAssignableRoles(this.data.project.location!);
    }
  }

  onClose() {
    this.projectTeamMemberRoleDialogRef.close();
  }

  assignProjectRoles(projectRole: ProjectRole) {
    return this.data.teamMember.roles.find(role => role !== projectRole);
  }

  isAssignable(projectRole: ProjectRole) {
    return ProjectRole.addable.find(role => role === projectRole) && this.assignableRoles.find(role => role !== projectRole);
  }

  updateTeamMember() {
    this.data.teamMember.roles = this.role.value;
    this.data.projectViewState.change({team: {update: this.data.teamMember}});
    this.projectTeamMemberRoleDialogRef.close();
  }

}

interface IProjectTeamMemberRoleDialog {
  project: Project;
  projectViewState: ProjectViewStateService;
  teamMember: TeamMember;
}
