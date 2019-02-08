import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';

export interface ProjectCreationResult {
  name: string;
}

@Component({
  selector: 'app-project-create-dialog',
  templateUrl: './project-create-dialog.component.html',
  styleUrls: ['./project-create-dialog.component.scss'],
})
export class ProjectCreateDialogComponent {

  form = this.formBuilder.group({
    name: ['', Validators.required],
  });

  static open(dialog: MatDialog): MatDialogRef<ProjectCreateDialogComponent, any> {
    return dialog.open(ProjectCreateDialogComponent, {
      width: '400px',
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
  ) {
  }

  isNameTaken = (name: string) => this.projectService.isProjectNameTaken(name);

  onCreate = async (value: ProjectCreationResult) => {
    const projectId = await this.projectService.createProject(value);
    this.router.navigate(['/projects', projectId]);
  }
}
