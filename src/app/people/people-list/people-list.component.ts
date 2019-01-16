import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TypedSort } from '@app/core/util';
import { QueryParams } from '@app/shared/components/table-view/table-view.component';
import { map } from 'rxjs/operators';
import { TitleAware } from '../../core/decorators';
import { Organization } from '../../core/models/organization';
import { ProjectRole } from '../../core/models/project-role';
import { UserFilter, UserListItem } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
@TitleAware('People')
export class PeopleListComponent {

  readonly ProjectRole = ProjectRole;

  readonly displayedColumns: Array<keyof UserListItem> = [
    'avatarLetters',
    'displayFirstName',
    'displayLastName',
    'organizations',
    'projectCount',
    'isActive',
  ];
  readonly defaultSort: TypedSort<keyof UserListItem> = {
    active: 'displayFirstName',
    direction: 'asc',
  };

  constructor(private userService: UserService,
              private router: Router) {}

  fetchPeople = ({ sort, dir, page, size }: QueryParams<keyof UserListItem>, filters: UserFilter) => {
    return this.userService
      .getUsers(sort, dir, (page - 1) * size, size, filters)
      .pipe(
        map(({ users, total }) => ({ data: users, total })),
      );
  };

  onOrgClick(org: Organization) {
    this.router.navigate(['/organizations', org.id]);
  }
}
