import { Component, Inject, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatStepper } from '@angular/material';
import { Project } from '../../../core/models/project';
import { ProjectRole } from '../../../core/models/project-role';
import { TeamMember } from '../../../core/models/team-member';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { TypedFormControl } from '../../../core/util';
import { SubscriptionComponent } from '../../../shared/components/subscription.component';
import { ProjectViewStateService } from '../../project-view-state.service';

@Component({
  selector: 'app-project-team-member-add',
  templateUrl: './project-team-member-add.component.html',
  styleUrls: ['./project-team-member-add.component.scss']
})
export class ProjectTeamMemberAddComponent extends SubscriptionComponent {

  readonly ProjectRole = ProjectRole;

  @ViewChild(MatStepper) stepper: MatStepper;

  readonly projectViewState: ProjectViewStateService;
  readonly project: Project;

  user = new TypedFormControl<User | null>(null, Validators.required);
  roles = new TypedFormControl<ProjectRole[]>([], Validators.required);
  availableRoles: ProjectRole[] = [];
  submitting = false;

  constructor(private dialogRef: MatDialogRef<ProjectTeamMemberAddComponent>,
              private snackBar: MatSnackBar,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) data: { project: Project, projectViewState: ProjectViewStateService }) {
    super();
    this.projectViewState = data.projectViewState;
    this.project = data.project;
    this.projectViewState.isSubmitting
      .takeUntil(this.unsubscribe)
      .subscribe(s => this.submitting = s);
  }

  get currentUsers() {
    return this.project.team.map(member => member.user);
  }

  get pending() {
    return this.user.pending || this.submitting;
  }

  async onUserSelected(user: User | null) {
    if (!user) {
      this.user.setValue(user);
      this.availableRoles = [];
      return;
    }

    this.user.setValue(null);
    this.user.markAsPending();
    try {
      this.availableRoles = await this.userService.getAssignableRoles(user!.id, this.project);
    } catch (e) {
      this.snackBar.open('Failed to fetch project roles', undefined, {
        duration: 3000
      });
    } finally {
      this.user.reset(user);
    }
  }

  async onSubmit() {
    if (this.user.invalid || this.roles.invalid) {
      return;
    }

    const member = TeamMember.new(this.user.value!, this.roles.value);
    this.projectViewState.change({team: {add: member}});

    try {
      await this.projectViewState.save();
    } catch (e) {
      this.snackBar.open('Failed to add team member', undefined, {
        duration: 3000
      });
      return;
    }

    this.dialogRef.close();
  }
}
