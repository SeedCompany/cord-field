import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Directory, FileNodeType } from '@app/core/models/files';
import { ProjectFilesService } from '@app/core/services/project-files.service';

@Component({
  selector: 'app-overwrite-file-warning',
  templateUrl: './overwrite-file-warning.component.html',
  styleUrls: ['./overwrite-file-warning.component.scss'],
})
export class OverwriteFileWarningComponent {

  readonly form: FormGroup;
  isRenaming = false;
  readonly file: File;
  readonly isOverwritingFile: boolean;

  static open(dialog: MatDialog, parent: Directory, file: File): MatDialogRef<OverwriteFileWarningComponent, string> {
    return dialog.open(this, {
      minWidth: '400px',
      autoFocus: true,
      data: { parent, file },
    });
  }

  constructor(
    private dialogRef: MatDialogRef<OverwriteFileWarningComponent, string>,
    @Inject(MAT_DIALOG_DATA) { parent, file }: { parent: Directory, file: File },
    private fileService: ProjectFilesService,
    private fb: FormBuilder,
  ) {
    this.file = file;
    this.isOverwritingFile = parent.children.find(node => node.name === file.name)!.type === FileNodeType.File;
    this.isRenaming = !this.isOverwritingFile;

    const uniqueNameValidator: ValidatorFn = control => {
      const exists = parent.children.some(child => child.name === control.value);
      if (exists && control.dirty) {
        // Show error after user changes value so use doesn't have to click off field to see why they can't click submit button.
        control.markAsTouched();
      }
      return exists ? { exists: true } : null;
    };

    this.form = this.fb.group({
      name: [file.name, [Validators.required, uniqueNameValidator]],
    });
  }

  get name(): AbstractControl {
    return this.form.get('name')!;
  }

  onUpdate() {
    this.dialogRef.close(this.file.name);
  }

  onRename() {
    this.isRenaming = true;
  }

  onUpload() {
    this.dialogRef.close(this.name.value);
  }
}
