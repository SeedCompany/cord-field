import { Directive, HostListener, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';

export function showNotImplemented(snackBar: MatSnackBar, message?: string) {
  snackBar.open(message || 'This is not implemented yet', undefined, {duration: 3000});
}

@Directive({
  selector: 'a[appNotImplemented], button[appNotImplemented]'
})
export class NotImplementedDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('appNotImplemented') message: string;

  constructor(private snackBar: MatSnackBar) {
  }

  @HostListener('click') onClick(): void {
    showNotImplemented(this.snackBar, this.message);
  }
}
