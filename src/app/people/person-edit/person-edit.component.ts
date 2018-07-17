import { Component } from '@angular/core';
import { UserViewStateService } from '../user-view-state.service';
import { AbstractPersonComponent } from './abstract-person.component';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent extends AbstractPersonComponent {
  constructor(userViewState: UserViewStateService) {
    super(userViewState);
  }
}
