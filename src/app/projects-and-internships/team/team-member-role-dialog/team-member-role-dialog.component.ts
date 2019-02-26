import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { Internship } from '@app/core/models/internship';
import { Project } from '@app/core/models/project';
import { Role } from '@app/core/models/role';
import { TeamMember } from '@app/core/models/team-member';
import { UserService } from '@app/core/services/user.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

type Subject = Project | Internship;
type ViewState = AbstractViewState<Subject, unknown>;

interface DialogData {
  subject: Subject;
  viewState: ViewState;
  teamMember: TeamMember;
}

@Component({
  templateUrl: './team-member-role-dialog.component.html',
  styleUrls: ['./team-member-role-dialog.component.scss'],
})
export class TeamMemberRoleDialogComponent extends SubscriptionComponent {

  readonly Role = Role;

  readonly subject: Subject;
  readonly viewState: ViewState;
  readonly teamMember: TeamMember;
  assignableRoles: Role[];

  roles = new FormControl([], Validators.required);
  loading = true;
  submitting = false;

  static open(
    dialog: MatDialog,
    teamMember: TeamMember,
    subject: Subject,
    viewState: ViewState,
  ): MatDialogRef<TeamMemberRoleDialogComponent> {
    return dialog.open(TeamMemberRoleDialogComponent, {
      width: '400px',
      data: { teamMember, subject, viewState },
    });
  }

  constructor(private dialogRef: MatDialogRef<TeamMemberRoleDialogComponent>,
              private userService: UserService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: DialogData) {
    super();
    this.subject = data.subject;
    this.viewState = data.viewState;
    this.teamMember = data.teamMember;

    this.roles.reset(this.teamMember.roles);

    this.viewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(s => this.submitting = s);

    this.loadRoles();
  }

  async loadRoles() {
    this.loading = true;
    try {
      this.assignableRoles = await this.userService.getAssignableRoles(this.teamMember.id, this.subject, this.teamMember);
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
    this.viewState.change({ team: { update: member } });

    try {
      await this.viewState.save();
    } catch (e) {
      this.snackBar.open(`Failed to change team member's roles`, undefined, {
        duration: 3000,
      });
      return;
    }

    this.dialogRef.close();
  }
}
