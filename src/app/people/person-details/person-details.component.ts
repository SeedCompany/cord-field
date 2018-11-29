import { Component } from '@angular/core';
import { AbstractPersonComponent } from '../person-edit/abstract-person.component';
import { UserViewStateService } from '../user-view-state.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
})
export class PersonDetailsComponent extends AbstractPersonComponent {
  constructor(userViewState: UserViewStateService) {
    super(userViewState);
  }
}
