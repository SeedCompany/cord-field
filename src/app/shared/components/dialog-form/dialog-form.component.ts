import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { enableControl, maybeObservable, MaybeObservable } from '@app/core/util';
import { getValue } from '@app/core/util/forms';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { EMPTY, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent<C, T, R = any> extends SubscriptionComponent {

  // tslint:disable-next-line:no-input-rename
  @Input('formGroup') form: AbstractControl;
  @Input('formControl') set formControl(form: FormControl) {
    this.form = form;
  }
  @Input() handleSubmit: (formVal: T, action: string) => MaybeObservable<R>;
  @Input() title: string;
  @Input() submitText: string;
  @Input() failureText: string;
  @Input() disableCloseWhileSubmitting = true;

  private errorRef?: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private dialogRef: MatDialogRef<C, R>,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  submit(action = 'submit') {
    if (this.form.invalid || this.form.disabled) {
      return;
    }

    this.dismissError();
    enableControl(this.form, false);
    if (this.disableCloseWhileSubmitting) {
      this.dialogRef.disableClose = true;
    }

    maybeObservable(this.handleSubmit(getValue(this.form), action), of(undefined))
      .pipe(
        catchError(() => {
          this.errorRef = this.snackBar.open(this.failureText, undefined, { duration: 3000 });
          return EMPTY;
        }),
        finalize(() => {
          enableControl(this.form, true);
          if (this.disableCloseWhileSubmitting) {
            this.dialogRef.disableClose = false;
          }
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe(result => {
        this.dismissError();
        this.dialogRef.close(result);
      });
  }

  close() {
    this.dialogRef.close();
  }

  private dismissError() {
    if (this.errorRef) {
      this.errorRef.dismiss();
      delete this.errorRef;
    }
  }
}
