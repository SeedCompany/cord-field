import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../core/models/project';
import { Role } from '../../core/models/role';
import { TeamMember } from '../../core/models/team-member';
import { UserService } from '../../core/services/user.service';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-team-member-role-dialog',
  templateUrl: './project-team-member-role-dialog.component.html',
  styleUrls: ['./project-team-member-role-dialog.component.scss'],
})
export class ProjectTeamMemberRoleDialogComponent extends SubscriptionComponent {

  readonly Role = Role;

  readonly project: Project;
  readonly projectViewState: ProjectViewStateService;
  readonly teamMember: TeamMember;
  assignableRoles: Role[];

  roles = new FormControl([], Validators.required);
  loading = true;
  submitting = false;

  constructor(private dialogRef: MatDialogRef<ProjectTeamMemberRoleDialogComponent>,
              private userService: UserService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: DialogData) {
    super();
    this.project = data.project;
    this.projectViewState = data.projectViewState;
    this.teamMember = data.teamMember;

    this.roles.reset(this.teamMember.roles);

    this.projectViewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(s => this.submitting = s);

    this.loadRoles();
  }

  async loadRoles() {
    this.loading = true;
    try {
      this.assignableRoles = await this.userService.getAssignableRoles(this.teamMember.id, this.project, this.teamMember);
      this.loading = false;
    } catch (e) {
      this.snackBar.open(`Failed to fetch team member's available roles`, undefined, {
        duration: 3000,
      });
      this.dialogRef.close();
    }
  }

  async onSubmit() {
    const member = this.teamMember.withRoles(this.roles.value);
    this.projectViewState.change({team: {update: member}});

    try {
      await this.projectViewState.save();
    } catch (e) {
      this.snackBar.open(`Failed to change team member's roles`, undefined, {
        duration: 3000,
      });
      return;
    }

    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}

interface DialogData {
  project: Project;
  projectViewState: ProjectViewStateService;
  teamMember: TeamMember;
}
