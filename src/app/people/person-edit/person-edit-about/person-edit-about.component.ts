import { Component } from '@angular/core';
import { TitleAware } from '../../../core/decorators';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-about',
  templateUrl: './person-edit-about.component.html',
  styleUrls: ['./person-edit-about.component.scss']
})
@TitleAware('Edit About')
export class PersonEditAboutComponent extends AbstractPersonComponent {
  constructor(userViewState: UserViewStateService) {
    super(userViewState);
  }
}
