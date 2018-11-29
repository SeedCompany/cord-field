import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { User } from '@app/core/models/user';
import { UserService } from '@app/core/services/user.service';

import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-autocomplete-user',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    ValueAccessorProvider(AutocompleteUserComponent),
  ],
})
export class AutocompleteUserComponent extends AutocompleteComponent<User> {

  @Input() placeholder = 'User';
  @Input() requiredMessage = 'Please specify a user';
  @Input() serverErrorMessage = 'Failed to fetch users';
  @Input() displayItem = (user: User) => user.fullName;
  @Input() trackBy = (user: User) => user.fullName;
  @Input() fetcher = (term: string) => this.userService.search(term);

  constructor(
    private userService: UserService,
    snackBar: MatSnackBar,
  ) {
    super(snackBar);
  }
}
