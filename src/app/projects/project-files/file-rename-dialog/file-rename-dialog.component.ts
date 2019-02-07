import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Directory, FileNode, FileNodeType } from '@app/core/models/files';
import { ProjectFilesService } from '@app/core/services/project-files.service';

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
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

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
    private fileService: ProjectFilesService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
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

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const newName = this.name.value.trim();

    // If no change, just close dialog
    if (this.node.name === newName) {
      this.dialogRef.close();
      return;
    }

    let newNode;
    this.form.disable();
    this.dialogRef.disableClose = true;
    try {
      newNode = await this.fileService.rename(newName, this.node, this.parent);
    } catch (e) {
      this.showSnackBar('Failed to rename ' + FileNodeType.forUI(this.node.type)!.toLowerCase());
      return;
    } finally {
      this.form.enable();
      this.dialogRef.disableClose = false;
    }

    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.dialogRef.close(newNode);
  }

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000,
    });
  }
}
