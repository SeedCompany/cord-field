import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ProjectType, projectTypeList, projectTypeToString } from '../../core/models/project';

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

  constructor(
    public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required]
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
