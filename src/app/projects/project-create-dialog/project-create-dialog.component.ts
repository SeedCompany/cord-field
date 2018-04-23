import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
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
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  constructor(public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private router: Router,
              private snackBar: MatSnackBar) {
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
      .switchMap(async (name) => {
        try {
          return await this.projectService.isProjectNameTaken(name);
        } catch (e) {
          return e;
        }
      })
      .subscribe((taken: boolean | HttpErrorResponse) => {
        if (this.name.hasError('required')) {
          // If we are here the response has been returned after the user cleared the field
          // Even if the name is available, we don't want to remove the required error.
          return;
        }
        this.name.markAsTouched(); // Be sure first error shows immediately instead of waiting for field to blur

        if (taken instanceof HttpErrorResponse) {
          this.showSnackBar('Failed to check project name availability');
          return;
        }

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
    let projectId;
    this.submitting = true;
    this.form.disable();
    this.dialogRef.disableClose = true;
    try {
      projectId = await this.projectService.createProject(this.form.value);
    } catch (e) {
      this.showSnackBar('Failed to create project');
      return;
    } finally {
      this.submitting = false;
      this.form.enable();
      this.dialogRef.disableClose = false;
    }

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.dialogRef.close();
    this.router.navigate(['/projects', projectId]);
  }

  onClose() {
    this.dialogRef.close();
  }

  trackByValue(index, value) {
    return value;
  }

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, null, {
      duration: 3000
    });
  }
}
