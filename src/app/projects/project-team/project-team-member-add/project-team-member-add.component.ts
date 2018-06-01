import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatStep, MatStepper } from '@angular/material';
import { Project } from '../../../core/models/project';
import { ProjectRole } from '../../../core/models/project-role';
import { TeamMember } from '../../../core/models/team-member';
import { User } from '../../../core/models/user';
import { AutocompleteUserComponent } from '../../../shared/components/autocomplete/autocomplete-user.component';
import { ProjectViewStateService } from '../../project-view-state.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-project-team-member-add',
  templateUrl: './project-team-member-add.component.html',
  styleUrls: ['./project-team-member-add.component.scss']
})
export class ProjectTeamMemberAddComponent implements AfterViewInit {

  readonly ProjectRole = ProjectRole;

  @ViewChild(MatStepper) stepper: MatStepper;
  @ViewChild('userStep') userStep: MatStep;
  @ViewChild(AutocompleteUserComponent) autocomplete: AutocompleteUserComponent;

  readonly projectViewState: ProjectViewStateService;
  readonly project: Project;

  user: User | null;
  roles = new FormControl([], Validators.required);
  availableRoles: ProjectRole[] = [];
  submitting = false;

  constructor(private dialogRef: MatDialogRef<ProjectTeamMemberAddComponent>,
              private snackBar: MatSnackBar,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) data: { project: Project, projectViewState: ProjectViewStateService }) {
    this.projectViewState = data.projectViewState;
    this.project = data.project;

    this.projectViewState.isSubmitting.subscribe(s => this.submitting = s);
  }

  ngAfterViewInit(): void {
    this.userStep.stepControl = this.autocomplete.search;
  }

  get currentUsers() {
    return this.project.team.map(member => member.user);
  }

  onUserSelected(user: User | null) {
    this.user = user;
    this.userService.getAssignableRoles(user.id, this.project.location.id)
      .then(r => console.log(r))
      .catch(e => console.log(e));
    // this.availableRoles = user ? user.getAssignableRoles(this.project.location!) : [];
  }

  async onSubmit() {
    const member = TeamMember.new(this.user!, this.roles.value as ProjectRole[]);
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
