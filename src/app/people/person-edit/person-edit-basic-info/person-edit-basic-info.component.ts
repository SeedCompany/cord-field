import { Component } from '@angular/core';
import { TitleAware } from '../../../core/decorators';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-basic-info',
  templateUrl: './person-edit-basic-info.component.html',
  styleUrls: ['./person-edit-basic-info.component.scss']
})
@TitleAware('Edit Basic Info')
export class PersonEditBasicInfoComponent extends AbstractPersonComponent {
  constructor(userViewState: UserViewStateService) {
    super(userViewState);
  }
}
