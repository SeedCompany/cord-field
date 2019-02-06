import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
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
  submitting = false;
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  static open(dialog: MatDialog): MatDialogRef<ProjectCreateDialogComponent, any> {
    return dialog.open(ProjectCreateDialogComponent, {
      width: '400px',
    });
  }

  constructor(public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  isNameTaken = (name: string) => this.projectService.isProjectNameTaken(name);

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

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000,
    });
  }
}
