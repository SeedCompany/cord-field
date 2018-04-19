import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {

  constructor(private snackBar: MatSnackBar,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  dismiss() {
    this.snackBar._openedSnackBarRef.dismiss();
  }
}
