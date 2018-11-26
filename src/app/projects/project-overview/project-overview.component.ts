import { Component } from '@angular/core';
import { TitleAware } from '@app/core/decorators';
import { ProjectType } from '@app/core/models/project/type';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
@TitleAware('')
export class ProjectOverviewComponent extends ProjectTabComponent {

  readonly ProjectType = ProjectType;

  constructor(projectViewState: ProjectViewStateService) {
    super(projectViewState);
  }
}
