import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-project-create-dialog',
  templateUrl: './project-create-dialog.component.html',
  styleUrls: ['./project-create-dialog.component.scss']
})
export class ProjectCreateDialogComponent implements OnInit {

  projectTypes: string[];
  projectName = '';
  projectType = '';

  projectForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string[],
              private formBuilder: FormBuilder) {
    this.projectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      projectType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.projectTypes = this.data;
  }

  onClose() {
    this.dialogRef.close();
  }
  trackByFn(index, project) {
    return index;
  }
}
