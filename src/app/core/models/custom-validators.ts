import { AbstractControl } from '@angular/forms';
import { TypedFormControl } from './util';

export class CustomValidators {

  static email(control: AbstractControl) {
    const regex = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
    return regex.test(control.value) ? null : {invalidEmail: true};
  }

  static dateRange(startFieldName: string, endFieldName: string) {
    return (control: AbstractControl) => {
      const start = control.get(startFieldName) as TypedFormControl<Date | null> | null;
      const end = control.get(endFieldName) as TypedFormControl<Date | null> | null;

      if (!start) {
        throw new Error(`Form does not have control named: "${startFieldName}".`);
      }
      if (!end) {
        throw new Error(`Form does not have control named: "${endFieldName}".`);
      }

      if (!start.value || !end.value || start.value <= end.value) {
        // Remove invalidRange error if it was previously set. Reasons below.
        if (start.hasError('invalidRange')) {
          const {invalidRange: startInvalidRange = null, ...startErrors} = start.errors!;
          start.setErrors(Object.keys(startErrors).length > 0 ? startErrors : null);
        }
        if (end.hasError('invalidRange')) {
          const {invalidRange: endInvalidRange = null, ...endErrors} = end.errors!;
          start.setErrors(Object.keys(endErrors).length > 0 ? endErrors : null);
        }

        return null;
      }

      // Set the errors on fields (not just the form)
      // This marks the field as invalid, so view states can know to not evaluate it
      // And to style the field as invalid (red label and line)
      start.setErrors({...start.errors, invalidRange: true});
      end.setErrors({...end.errors, invalidRange: true});

      // Mark both fields as touched so errors show up for both fields
      start.markAsTouched();
      end.markAsTouched();

      return {invalidRange: true};
    };
  }
}
