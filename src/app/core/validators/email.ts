import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms/src/directives/validators';

const EMAIL_REGEX = /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/;

export function email(control: AbstractControl): ValidationErrors | null {
  return control.value && EMAIL_REGEX.test(control.value) ? null : {invalidEmail: true};
}
