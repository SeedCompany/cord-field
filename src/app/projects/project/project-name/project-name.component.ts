import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProjectService } from '@app/core/services/project.service';
import { ProjectTabComponent } from '@app/projects/abstract-project-tab';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss'],
})
export class ProjectNameComponent extends ProjectTabComponent implements OnInit {

  name: FormControl;

  constructor(
    projectViewState: ProjectViewStateService,
    private projectService: ProjectService,
  ) {
    super(projectViewState);
  }

  isTaken = (name: string) => this.projectService.isProjectNameTaken(name);

  ngOnInit() {
    this.name = this.projectViewState.fb.control({
      field: 'name',
      unsubscribe: this.unsubscribe,
      validators: [Validators.required],
    });
  }
}
