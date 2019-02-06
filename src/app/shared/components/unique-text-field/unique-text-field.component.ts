import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { SimpleValueAccessor, ValueAccessorProvider } from '@app/core/classes/simple-value-accessor';
import { maybeObservable, MaybeObservable, TypedFormControl } from '@app/core/util';
import { of } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-unique-text-field',
  templateUrl: './unique-text-field.component.html',
  styleUrls: ['./unique-text-field.component.scss'],
  providers: [
    ValueAccessorProvider(UniqueTextFieldComponent),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class UniqueTextFieldComponent extends SimpleValueAccessor<string> implements OnInit {

  @Input() isTaken: (text: string) => MaybeObservable<boolean>;
  @Input() original = '';
  @Input() placeholder = '';
  @Input() maxLength = 140;
  @Input() pending = 'Checking availability...';

  @Input() set validators(validators: ValidatorFn[]) {
    if (validators) {
      this.text.setValidators(validators);
    }
  }

  @Input() set errorMessages(errors: Record<string, string>) {
    this._errorMessages = { ...this._errorMessages, ...errors };
  }

  private _errorMessages: Record<string, string> = {
    required: 'Required',
    duplicate: 'Already in use',
    minlength: 'At least 2 characters long',
  };

  readonly text: TypedFormControl<string> = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
  ]);

  constructor(
    private snackBar: MatSnackBar,
  ) {
    super();

    let touched = this.text.touched;
    Object.defineProperty(this.text, 'touched', {
      get: () => touched,
      set: (v: boolean) => {
        touched = v;
        if (v) {
          this.onTouched();
        }
      },
    });
  }

  ngOnInit() {
    this.text
      .valueChanges
      .pipe(
        map(text => text.trim()),
        filter(text => {
          // If invalid send empty value to represent invalid and don't continue
          if (this.text.invalid) {
            this.onChange('');
            return false;
          }
          // If value is original send it, but don't check uniqueness
          if (text === this.original) {
            this.onChange(text);
            return false;
          }

          // Text is valid and not original, continue validation
          // Send empty value to represent invalid while we run validation.
          this.onChange('');
          return true;
        }),
        tap(() => this.text.markAsPending()),
        debounceTime(500),
        switchMap(text =>
          maybeObservable(this.isTaken(text))
            .pipe(catchError(err => of(err))),
        ),
        takeUntil(this.unsubscribe),
      )
      .subscribe(taken => {
        if (taken instanceof HttpErrorResponse) {
          this.snackBar.open('Failed to check availability', undefined, { duration: 3000 });
          return;
        }

        // Assert field is still valid, before replacing the errors
        if (this.text.invalid) {
          return;
        }

        // Send value if valid or display error
        if (!taken) {
          this.text.setErrors(null); // Clear pending status
          this.onChange(this.text.value);
        } else {
          this.text.setErrors({ duplicate: true });
        }
      });
  }

  displayError(): string {
    const keys = Object.keys(this.text.errors || {});
    return this._errorMessages[keys[0]] || '';
  }

  writeValue(text: string): void {
    this.text.reset(text, { emitEvent: false });
  }

  setDisabledState(isDisabled: boolean): void {
    this.text[isDisabled ? 'disable' : 'enable']({ emitEvent: false });
  }
}
