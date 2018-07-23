import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { TitleAware } from '../../core/decorators';
import { Project } from '../../core/models/project';
import { ProjectRole } from '../../core/models/project-role';
import { TeamMember } from '../../core/models/team-member';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { ProjectTeamMemberRoleDialogComponent } from '../project-team-member-role-dialog/project-team-member-role-dialog.component';
import { ProjectViewStateService } from '../project-view-state.service';
import { ProjectTeamMemberAddComponent } from './project-team-member-add/project-team-member-add.component';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.scss']
})
@TitleAware('Team')
export class ProjectTeamComponent extends SubscriptionComponent implements OnInit, AfterViewInit {

  readonly displayedColumns = ['avatar', 'firstName', 'lastName', 'dateAdded', 'roles'];
  readonly pageSizeOptions = [10, 25, 50];

  project: Project;
  dataSource = new MatTableDataSource<TeamMember>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private projectViewState: ProjectViewStateService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.projectViewState.project
      .takeUntil(this.unsubscribe)
      .subscribe(project => {
        this.project = project;
        this.dataSource.data = project.team;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: TeamMember, term: string) => {
      const fields = [
        data.firstName,
        data.lastName,
        this.showRoles(data.roles)
      ];

      return fields.join(' ').toLowerCase().includes(term.trim().toLowerCase());
    };
  }

  showRoles(roles: ProjectRole[]): string {
    return roles.map(role => ProjectRole.forUI(role)).join(', ');
  }

  onSearch(term: string) {
    this.dataSource.filter = term;
  }

  onRemove(member: TeamMember) {
    this.projectViewState.change({team: {remove: member}});
    this.projectViewState.save();
  }

  onAssign() {
    if (!this.project.location) {
      this.snackBar.open('Set the project location to assign users', undefined, {
        duration: 3000
      });
      return;
    }

    this.dialog.open(ProjectTeamMemberAddComponent, {
      width: '400px',
      data: {
        project: this.project,
        projectViewState: this.projectViewState
      }
    });
  }

  onChangeRoles(teamMember: TeamMember) {
    this.dialog.open(ProjectTeamMemberRoleDialogComponent, {
      width: '400px',
      data: {
        teamMember,
        project: this.project,
        projectViewState: this.projectViewState
      }
    });
  }
}
