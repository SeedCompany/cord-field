import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-autocomplete-user',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteUserComponent extends AutocompleteComponent<User> {

  @Input() placeholder = 'Users';
  @Input() requiredMessage = 'Please enter a user';
  @Input() serverErrorMessage = 'Failed to fetch users';
  @Input() displayItem = (user: User) => user.fullName;
  @Input() trackBy = (user: User) => user.id;
  @Input() fetcher = (term: string) => this.userService.search(term);

  constructor(private userService: UserService, snackBar: MatSnackBar) {
    super(snackBar);
  }
}
