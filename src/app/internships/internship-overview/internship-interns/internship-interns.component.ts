import { Component, Input, OnInit } from '@angular/core';
import { ProjectStatus } from '@app/core/models/project';
import { Role } from '@app/core/models/role';
import { TeamMember } from '@app/core/models/team-member';
import { User } from '@app/core/models/user';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UserService } from '@app/core/services/user.service';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-internship-interns',
  templateUrl: './internship-interns.component.html',
  styleUrls: ['./internship-interns.component.scss'],
})
export class InternshipInternsComponent extends SubscriptionComponent implements OnInit {

  interns: TeamMember[] = [];
  adding = false;
  private team: TeamMember[];
  canAdd = false;
  isAdmin = false;

  @Input()
  status: ProjectStatus;

  constructor(
    private viewState: InternshipViewStateService,
    private authService: AuthenticationService,
    private userService: UserService,
  ) {
    super();
  }

  ngOnInit() {
    combineLatest(
      [this.viewState.subjectWithChanges,
        this.isUserAdmin()])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async ([{team}]) => {
        this.team = team;
        this.interns = team.filter(tm => tm.roles.includes(Role.Intern));
        if (await this.isAdmin && this.status === 'active') {
          this.canAdd = true;
        }
      });
  }

  onSelect(user: User) {
    const existing = this.team.find(tm => tm.fullName === user.fullName);
    if (existing) {
      const tm = existing.withRoles([...existing.roles, Role.Intern]);
      this.viewState.change({team: {update: tm}});
    } else {
      const tm = TeamMember.new(user, [Role.Intern]);
      this.viewState.change({team: {add: tm}});
    }
    this.adding = false;
  }

  onAdd() {
    this.adding = true;
  }

  onCancel() {
    this.adding = false;
  }

  onDelete(tm: TeamMember) {
    this.viewState.change({team: {remove: tm}});
  }

  trackById(index: number, intern: TeamMember) {
    return intern.id;
  }

  async isUserAdmin() {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser !== null) {
      if (await this.userService.isAdmin(currentUser)) {
        this.isAdmin = true;
      }
    }
  }
}
