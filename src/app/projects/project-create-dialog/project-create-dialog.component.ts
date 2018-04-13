import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
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

  constructor(public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.name
      .valueChanges
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .debounceTime(500)
      .distinctUntilChanged()
      .do(() => this.name.markAsPending())
      .switchMap(name => this.projectService.isProjectNameTaken(name))
      .subscribe(taken => {
        if (this.name.hasError('required')) {
          // If we are here the response has been returned after the user cleared the field
          // Even if the name is available, we don't want to remove the required error.
          return;
        }
        this.name.markAsTouched();
        this.name.setErrors(taken ? {duplicate: true} : null);
      });
  }

  get type() {
    return this.form.get('type');
  }

  get name() {
    return this.form.get('name');
  }

  onClose() {
    this.dialogRef.close();
  }

  trackByValue(index, value) {
    return value;
  }
}
