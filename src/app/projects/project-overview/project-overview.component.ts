import { Component } from '@angular/core';
import { TitleAware } from '../../core/decorators';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
@TitleAware('')
export class ProjectOverviewComponent extends ProjectTabComponent {

  constructor(projectViewState: ProjectViewStateService) {
    super(projectViewState);
  }
}
