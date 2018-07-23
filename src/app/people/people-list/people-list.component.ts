import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../core/models/organization';
import { ProjectRole } from '../../core/models/project-role';
import { UserFilter, UserListItem, UsersWithTotal } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { PeopleListFilterComponent } from './people-list-filter/people-list-filter.component';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
  animations: [
    trigger('slideRight', [
      state('shown', style({transform: 'translateX(0)'})),
      state('hidden', style({transform: 'translateX(200%)'})),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ]
})
export class PeopleListComponent implements AfterViewInit {

  readonly ProjectRole = ProjectRole;

  readonly displayedColumns = ['avatar', 'displayFirstName', 'displayLastName', 'organizations', 'projectCount', 'isActive'];
  readonly pageSizeOptions = [10, 25, 50];
  peopleSource = new MatTableDataSource<UserListItem>();
  totalCount = 0;
  filtersActive = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(PeopleListFilterComponent) filtersComponent: PeopleListFilterComponent;

  constructor(private dialog: MatDialog,
              private userService: UserService,
              private router: Router) {}

  ngAfterViewInit() {
    Observable
      .combineLatest(
        this.sort.sortChange
          .do(() => this.paginator.pageIndex = 0)
          .startWith({active: '', direction: 'desc'} as Sort),
        this.paginator.page
          .startWith({pageIndex: 0, pageSize: 10, length: 0} as PageEvent),
        this.filtersComponent.filters
      )
      .switchMap(([sort, page, filters]: [Sort, PageEvent, UserFilter]) => {
        const users = this.userService.getUsers(
          sort.active as keyof UserListItem,
          sort.direction,
          page.pageIndex * page.pageSize,
          page.pageSize,
          filters
        );

        return Observable.combineLatest(
          users,
          Observable.of(filters)
        );
      })
      .subscribe(([data, filters]: [UsersWithTotal, UserFilter]) => {
        this.totalCount = data.total;
        this.peopleSource.data = data.users;
        this.filtersActive = Object.keys(filters).length > 0;
      });
  }

  onClearFilters() {
    this.filtersComponent.reset();
  }

  onOrgClick(org: Organization) {
    this.router.navigate(['/organizations', org.id]);
  }
}
