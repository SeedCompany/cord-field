import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ProjectRole } from '../../core/models/project-role';
import { TeamMember } from '../../core/models/team-member';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.scss']
})
export class ProjectTeamComponent implements AfterViewInit {

  readonly displayedColumns = ['avatar', 'firstName', 'lastName', 'updatedAt', 'roles'];
  readonly pageSizeOptions = [10, 25, 50];
  dataSource = new MatTableDataSource<TeamMember>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private projectViewState: ProjectViewStateService) {
  }

  ngAfterViewInit(): void {
    this.projectViewState.project.subscribe(project => {
      this.dataSource.data = project.team;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  showRoles(roles: ProjectRole[]): string {
    return roles.map(role => ProjectRole.forUI(role)).join(', ');
  }
}
