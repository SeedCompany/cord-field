import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
import { parsePhoneNumber } from 'libphonenumber-js';

export function phone(control: AbstractControl): ValidationErrors | null {
  const phoneValue = control.value;

  try {
    if (phoneValue) {
      return parsePhoneNumber(String(phoneValue), 'US').isValid() ? null : { invalidPhone: true };
    }
  } catch (error) {
    // Not a phone number, non-existent country, etc.
  }

  return null;
}
