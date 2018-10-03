import { Component } from '@angular/core';
import { ProjectTabComponent } from '@app/projects/abstract-project-tab';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';

@Component({
  selector: 'app-project-forms',
  templateUrl: './project-forms.component.html',
  styleUrls: ['./project-forms.component.scss']
})
export class ProjectFormsComponent extends ProjectTabComponent {
  constructor(private viewStateService: ProjectViewStateService) {
    super(viewStateService);
  }
}
