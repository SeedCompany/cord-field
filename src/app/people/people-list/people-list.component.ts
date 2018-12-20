import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Router } from '@angular/router';
import { TypedMatSort } from '@app/core/util';
import { combineLatest, of as observableOf } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { TitleAware } from '../../core/decorators';
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
      transition('shown <=> hidden', animate('200ms ease-out')),
    ]),
  ],
})
@TitleAware('People')
export class PeopleListComponent implements AfterViewInit {

  readonly ProjectRole = ProjectRole;

  readonly displayedColumns: Array<keyof UserListItem> = [
    'avatarLetters',
    'displayFirstName',
    'displayLastName',
    'organizations',
    'projectCount',
    'isActive',
  ];
  readonly pageSizeOptions = [10, 25, 50];
  peopleSource = new MatTableDataSource<UserListItem>();
  totalCount = 0;
  filtersActive = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: TypedMatSort<keyof UserListItem>;
  @ViewChild(PeopleListFilterComponent) filtersComponent: PeopleListFilterComponent;

  constructor(private userService: UserService,
              private router: Router) {}

  ngAfterViewInit() {
    combineLatest(
      this.sort.sortChange
        .pipe(
          tap(() => this.paginator.pageIndex = 0),
          startWith({active: this.sort.active, direction: this.sort.direction}),
        ),
      this.paginator.page
        .pipe(startWith({pageIndex: 0, pageSize: 10, length: 0} as PageEvent)),
      this.filtersComponent.filters,
    )
      .pipe(switchMap(([sort, page, filters]) => {
        const users = this.userService.getUsers(
          sort.active,
          sort.direction,
          page.pageIndex * page.pageSize,
          page.pageSize,
          filters,
        );

        return combineLatest(
          users,
          observableOf(filters),
        );
      }))
      .subscribe(([{users, total}, filters]) => {
        this.peopleSource.data = users;
        this.totalCount = total;
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
