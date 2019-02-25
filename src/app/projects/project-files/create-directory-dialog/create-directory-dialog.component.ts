import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Directory } from '@app/core/models/files';
import { ProjectFilesService } from '@app/core/services/project-files.service';

@Component({
  selector: 'app-create-directory-dialog',
  templateUrl: './create-directory-dialog.component.html',
  styleUrls: ['./create-directory-dialog.component.scss'],
})
export class CreateDirectoryDialogComponent {

  form: FormGroup;

  static open(dialog: MatDialog, parent: Directory): MatDialogRef<CreateDirectoryDialogComponent, Directory> {
    return dialog.open(this, {
      minWidth: '400px',
      data: parent,
    });
  }

  constructor(
    private dialogRef: MatDialogRef<CreateDirectoryDialogComponent, Directory>,
    @Inject(MAT_DIALOG_DATA) private parent: Directory,
    private fileService: ProjectFilesService,
    private fb: FormBuilder,
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

  onSubmit = ({ name }: { name: string }) => this.fileService.createDirectory(this.parent, name);
}
