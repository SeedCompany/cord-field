import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractControlOptions } from '@angular/forms/src/model';
import { mapValues } from 'lodash-es';
import { Observable } from 'rxjs';

export class TypedFormControl<T> extends FormControl {
  constructor(
    formState?: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(formState, validatorOrOpts);
  }

  readonly value: T;
  readonly valueChanges: Observable<T>;

  setValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.setValue(value, options);
  }

  patchValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.patchValue(value, options);
  }

  reset(formState?: T | {value: T, disabled: boolean}, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.reset(formState, options);
  }
}

/**
 * Enable/Disable a form control.
 * Don't emit value/status changes.
 * Re-apply errors after enabling. This allows server to apply errors while submitting & form disabled.
 */
export function enableControl(control: AbstractControl, enable: boolean) {
  if (!enable) {
    control.disable({ emitEvent: false });
    return;
  }
  const doIt = () => control.enable({ emitEvent: false });

  const controlErrors = control.errors;
  if (control instanceof FormGroup) {
    const childErrors = mapValues(control.controls, child => child.errors);
    doIt();
    mapValues(childErrors, (errors, key) => errors && control.get(key)!.setErrors(errors));
  } else if (control instanceof FormArray) {
    const childErrors = control.controls.map(child => child.errors);
    doIt();
    childErrors.map((errors, key) => errors && control.at(key).setErrors(errors));
  } else {
    doIt();
  }
  if (controlErrors) {
    control.setErrors(controlErrors);
  }
}

/**
 * Get the value of the form control regardless of enabled/disabled state.
 */
export function getValue<T>(control: TypedFormControl<T>): T;
export function getValue(control: AbstractControl): any;
export function getValue(control: AbstractControl): any {
  return (control instanceof FormGroup || control instanceof FormArray) ? control.getRawValue() : control.value;
}
