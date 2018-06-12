import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ProjectRole } from '../../core/models/project-role';
import { UserListItem, UsersWithTotal } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements AfterViewInit {

  readonly ProjectRole = ProjectRole;

  readonly displayedColumns = ['avatar', 'firstName', 'lastName', 'organization', 'roles', 'projectCount', 'status'];
  readonly pageSizeOptions = [10, 25, 50];
  peopleSource = new MatTableDataSource<UserListItem>();
  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private userService: UserService) { }

  ngAfterViewInit() {
    Observable.
      combineLatest(
        this.paginator.page
        .startWith({pageIndex: 0, pageSize: 10, length: 0} as PageEvent)
      )
      .switchMap(([page]) => {
        return this.userService.getUsers(
          page.pageIndex * page.pageSize,
          page.pageSize
        );
      })
      .subscribe((data: UsersWithTotal) => {
        this.totalCount = data.total;
        this.peopleSource.data = data.users;
      });
  }
}
