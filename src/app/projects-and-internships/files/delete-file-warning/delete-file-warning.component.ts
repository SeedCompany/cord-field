import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileNode } from '@app/core/models/files';

@Component({
  selector: 'app-delete-file-warning',
  templateUrl: './delete-file-warning.component.html',
  styleUrls: ['./delete-file-warning.component.scss'],
})
export class DeleteFileWarningComponent {
  readonly node: FileNode;

  static open(dialog: MatDialog, node: FileNode): MatDialogRef<DeleteFileWarningComponent, FileNode> {
    return dialog.open(this, {
      minWidth: '400px',
      autoFocus: true,
      data: {node},
    });
  }

  constructor(
    private dialogRef: MatDialogRef<DeleteFileWarningComponent, FileNode>,
    @Inject(MAT_DIALOG_DATA) {node}: { node: FileNode },
  ) {
    this.node = node;
  }
}
