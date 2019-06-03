import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { TitleAware } from '@app/core/decorators';
import { Internship } from '@app/core/models/internship';
import { Project } from '@app/core/models/project';
import { Role } from '@app/core/models/role';
import { TeamMember } from '@app/core/models/team-member';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';
import { TeamMemberAddComponent } from './team-member-add/team-member-add.component';
import { TeamMemberRoleDialogComponent } from './team-member-role-dialog/team-member-role-dialog.component';

@Component({
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
@TitleAware('Team')
export class TeamComponent extends SubscriptionComponent implements OnInit, AfterViewInit {

  readonly displayedColumns = ['avatar', 'firstName', 'lastName', 'dateAdded', 'roles'];
  readonly pageSizeOptions = [10, 25, 50];

  subject: Project | Internship;
  dataSource = new MatTableDataSource<TeamMember>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private viewState: AbstractViewState<Project | Internship, unknown>,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.viewState.subject
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(subject => {
        this.subject = subject;
        this.dataSource.data = subject.team;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: TeamMember, term: string) => {
      const fields = [
        data.firstName,
        data.lastName,
        this.showRoles(data.roles),
      ];

      return fields.join(' ').toLowerCase().includes(term.trim().toLowerCase());
    };
  }

  showRoles(roles: Role[]): string {
    return roles.map(role => Role.forUI(role)).join(', ');
  }

  onSearch(term: string) {
    this.dataSource.filter = term;
  }

  onRemove(member: TeamMember) {
    this.viewState.change({ team: { remove: member } });
    this.viewState.save();
  }

  onAssign() {
    if (!this.subject.location) {
      this.snackBar.open('Set the project/internship location to assign users', undefined, {
        duration: 3000,
      });
      return;
    }

    TeamMemberAddComponent.open(this.dialog, this.subject, this.viewState);
  }

  onChangeRoles(teamMember: TeamMember) {
    if (!this.subject.location) {
      this.snackBar.open('Set the project/internship location to change roles', undefined, {
        duration: 3000,
      });
      return;
    }

    TeamMemberRoleDialogComponent.open(this.dialog, teamMember, this.subject, this.viewState);
  }
}
