import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Directory } from '@app/core/models/file-node';
import { ProjectFilesService } from '@app/core/services/project-files.service';

@Component({
  selector: 'app-create-directory-dialog',
  templateUrl: './create-directory-dialog.component.html',
  styleUrls: ['./create-directory-dialog.component.scss'],
})
export class CreateDirectoryDialogComponent {

  form: FormGroup;
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  static open(dialog: MatDialog, parent: Directory): MatDialogRef<CreateDirectoryDialogComponent, Directory> {
    return dialog.open(this, {
      minWidth: '400px',
      autoFocus: true,
      data: parent,
    });
  }

  constructor(
    private dialogRef: MatDialogRef<CreateDirectoryDialogComponent, Directory>,
    @Inject(MAT_DIALOG_DATA) private parent: Directory,
    private fileService: ProjectFilesService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    const uniqueNameValidator: ValidatorFn = control => {
      const exists = parent.children.some(child => child.name === control.value);
      if (exists) {
        // Show error immediately so use doesn't have to click off field to see why they can't click create button.
        control.markAsTouched();
      }
      return exists ? { exists: true } : null;
    };

    this.form = this.fb.group({
      name: ['', [Validators.required, uniqueNameValidator]],
    });
  }

  get name(): AbstractControl {
    return this.form.get('name')!;
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    let directory: Directory;
    this.form.disable();
    this.dialogRef.disableClose = true;
    try {
      directory = await this.fileService.createDirectory(this.parent, this.name.value);
    } catch (e) {
      this.showSnackBar('Failed to create directory');
      return;
    } finally {
      this.form.enable();
      this.dialogRef.disableClose = false;
    }

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.dialogRef.close(directory);
  }

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000,
    });
  }
}
