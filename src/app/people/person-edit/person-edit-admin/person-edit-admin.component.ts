import { Component } from '@angular/core';
import { TitleAware } from '../../../core/decorators';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-admin',
  templateUrl: './person-edit-admin.component.html',
  styleUrls: ['./person-edit-admin.component.scss'],
})
@TitleAware('Edit Admin Settings')
export class PersonEditAdminComponent extends AbstractPersonComponent {
  constructor(userViewState: UserViewStateService) {
    super(userViewState);
  }
}
