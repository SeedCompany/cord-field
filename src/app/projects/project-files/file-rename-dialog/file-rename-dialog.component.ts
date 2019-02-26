import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Directory, FileNode, FileNodeType } from '@app/core/models/files';
import { FilesService } from '@app/core/services/files.service';

@Component({
  selector: 'app-file-rename-dialog',
  templateUrl: './file-rename-dialog.component.html',
  styleUrls: ['./file-rename-dialog.component.scss'],
})
export class FileRenameDialogComponent {

  readonly FileNodeType = FileNodeType;

  readonly form: FormGroup;
  readonly node: FileNode;
  private readonly parent: Directory;

  static open(dialog: MatDialog, parent: Directory, node: FileNode): MatDialogRef<FileRenameDialogComponent, FileNode> {
    return dialog.open(this, {
      minWidth: '400px',
      autoFocus: true,
      data: { parent, node },
    });
  }

  constructor(
    private dialogRef: MatDialogRef<FileRenameDialogComponent, FileNode>,
    @Inject(MAT_DIALOG_DATA) {parent, node}: {parent: Directory, node: FileNode},
    private fileService: FilesService,
    private fb: FormBuilder,
  ) {
    this.node = node;
    this.parent = parent;

    const uniqueDifferentNameValidator: ValidatorFn = control => {
      const exists = parent.children.some(child => child.id !== node.id && child.name === control.value);
      if (exists) {
        // Show error immediately so use doesn't have to click off field to see why they can't click submit button.
        control.markAsTouched();
      }
      return exists ? { exists: true } : null;
    };

    this.form = this.fb.group({
      name: [node.name, [Validators.required, uniqueDifferentNameValidator]],
    });
  }

  get name(): AbstractControl {
    return this.form.get('name')!;
  }

  onSubmit = ({ name }: { name: string }) => {
    const newName = name.trim();

    // If no change, do nothing
    if (this.node.name === newName) {
      return;
    }

    return this.fileService.rename(newName, this.node);
  }
}
