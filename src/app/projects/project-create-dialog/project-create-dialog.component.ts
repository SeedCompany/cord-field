import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ProjectType, projectTypeList, projectTypeToString } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';

export interface ProjectCreationResult {
  name: string;
  type: ProjectType;
}

@Component({
  selector: 'app-project-create-dialog',
  templateUrl: './project-create-dialog.component.html',
  styleUrls: ['./project-create-dialog.component.scss']
})
export class ProjectCreateDialogComponent implements OnInit {

  readonly types = projectTypeList;
  readonly typeToString = projectTypeToString;
  form: FormGroup;
  submitting = false;

  constructor(public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.name
      .valueChanges
      .map(name => name.trim())
      .filter(name => name.length > 1)
      .debounceTime(500)
      .distinctUntilChanged()
      .filter(() => !this.name.hasError('required')) // Don't continue if user has already cleared the text
      .do(() => this.name.markAsPending())
      .switchMap(name => this.projectService.isProjectNameTaken(name))
      .subscribe(taken => {
        if (this.name.hasError('required')) {
          // If we are here the response has been returned after the user cleared the field
          // Even if the name is available, we don't want to remove the required error.
          return;
        }
        this.name.markAsTouched(); // Be sure first error shows immediately instead of waiting for field to blur
        this.name.setErrors(taken ? {duplicate: true} : null);
      });
  }

  get type() {
    return this.form.get('type');
  }

  get name() {
    return this.form.get('name');
  }

  async onCreate() {
    this.form.disable();
    const project = {
      type: this.type.value,
      name: this.name.value
    };
    let projectId;
    this.submitting = true;
    try {
      this.dialogRef.disableClose = true;
      projectId = await this.projectService.createProject(project);
    } catch (e) {
      this.dialogRef.disableClose = false;
    }
    this.form.enable();
    this.submitting = false;
    this.dialogRef.close();
    this.router.navigate(['/projects', projectId]);
  }
  onClose() {
    this.dialogRef.close();
  }

  trackByValue(index, value) {
    return value;
  }
}
