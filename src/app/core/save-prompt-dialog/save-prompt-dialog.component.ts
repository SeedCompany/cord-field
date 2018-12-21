import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './save-prompt-dialog.component.html',
  styleUrls: ['./save-prompt-dialog.component.scss'],
})
export class SavePromptDialogComponent {
  static open(dialogs: MatDialog): MatDialogRef<SavePromptDialogComponent, boolean> {
    return dialogs.open(SavePromptDialogComponent, {
      width: '500px',
    });
  }
}
