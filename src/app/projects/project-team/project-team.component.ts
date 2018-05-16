import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ProjectRole } from '../../core/models/project-role';
import { TeamMember } from '../../core/models/team-member';
import { ProjectService } from '../../core/services/project.service';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.scss']
})
export class ProjectTeamComponent extends ProjectTabComponent implements AfterViewInit {

  readonly displayedColumns = ['firstName', 'lastName', 'updatedAt', 'projectRole'];
  readonly pageSizeOptions = [10, 25, 50];
  dataSource = new MatTableDataSource<TeamMember>();
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(projectViewState: ProjectViewStateService,
              private projectService: ProjectService) {
    super(projectViewState);
  }

  ngAfterViewInit(): void {
    this.projectService.getProject(this.project.id).subscribe(project => {
      this.dataSource.data = project.team;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  showRoles(roles: ProjectRole[]): string {
    return roles.map(role => ProjectRole.forUI(role)).join(', ');
  }
}
