import { Component } from '@angular/core';
import { TitleAware } from '@app/core/decorators';
import { ExtensionStatus, ProjectExtension } from '@app/core/models/project/extension';
import { ProjectTabComponent } from '@app/projects/abstract-project-tab';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';

@Component({
  selector: 'app-project-extensions',
  templateUrl: './project-extensions.component.html',
  styleUrls: ['./project-extensions.component.scss'],
})
@TitleAware('Extensions')
export class ProjectExtensionsComponent extends ProjectTabComponent {

  readonly ExtensionStatus = ExtensionStatus;

  constructor(projectViewState: ProjectViewStateService) {
    super(projectViewState);
  }

  trackExtensionBy(index: number, ext: ProjectExtension) {
    return ext.id;
  }
}
