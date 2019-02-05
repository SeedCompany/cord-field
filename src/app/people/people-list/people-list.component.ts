import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TypedSort } from '@app/core/util';
import { TitleAware } from '../../core/decorators';
import { Organization } from '../../core/models/organization';
import { UserListItem } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
@TitleAware('People')
export class PeopleListComponent {

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

  fetchPeople = this.userService.getUsers;

  onOrgClick(org: Organization) {
    this.router.navigate(['/organizations', org.id]);
  }
}
