import { Component, Inject, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatStepper } from '@angular/material';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { Internship } from '@app/core/models/internship';
import { Project } from '@app/core/models/project';
import { Role } from '@app/core/models/role';
import { TeamMember } from '@app/core/models/team-member';
import { User } from '@app/core/models/user';
import { UserService } from '@app/core/services/user.service';
import { TypedFormControl } from '@app/core/util';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

type Subject = Project | Internship;
type ViewState = AbstractViewState<Subject, unknown>;

@Component({
  templateUrl: './team-member-add.component.html',
  styleUrls: ['./team-member-add.component.scss'],
})
export class TeamMemberAddComponent extends SubscriptionComponent {

  readonly Role = Role;

  @ViewChild(MatStepper) stepper: MatStepper;

  readonly viewState: ViewState;
  readonly subject: Subject;

  user = new TypedFormControl<User | null>(null, Validators.required);
  roles = new TypedFormControl<Role[]>([], Validators.required);
  availableRoles: Role[] = [];
  submitting = false;

  static open(dialog: MatDialog, subject: Subject, viewState: ViewState): MatDialogRef<TeamMemberAddComponent> {
    return dialog.open(TeamMemberAddComponent, {
      width: '400px',
      data: { subject, viewState },
    });
  }

  constructor(private dialogRef: MatDialogRef<TeamMemberAddComponent>,
              private snackBar: MatSnackBar,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) data: { subject: Subject, viewState: ViewState }) {
    super();
    this.viewState = data.viewState;
    this.subject = data.subject;
    this.viewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(s => this.submitting = s);
  }

  get currentUsers() {
    return this.subject.team.map(member => member.user);
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
      this.availableRoles = await this.userService.getAssignableRoles(user!.id, this.subject);
    } catch (e) {
      this.snackBar.open('Failed to fetch assignable roles', undefined, {
        duration: 3000,
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
    this.viewState.change({team: {add: member}});

    try {
      await this.viewState.save();
    } catch (e) {
      this.snackBar.open('Failed to add team member', undefined, {
        duration: 3000,
      });
      return;
    }

    this.dialogRef.close();
  }
}
