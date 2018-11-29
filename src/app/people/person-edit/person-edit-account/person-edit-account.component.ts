import { Component } from '@angular/core';
import { TitleAware } from '../../../core/decorators';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-account',
  templateUrl: './person-edit-account.component.html',
  styleUrls: ['./person-edit-account.component.scss'],
})
@TitleAware('Edit Account')
export class PersonEditAccountComponent extends AbstractPersonComponent {

  constructor(userViewState: UserViewStateService) {
    super(userViewState);
  }
}
