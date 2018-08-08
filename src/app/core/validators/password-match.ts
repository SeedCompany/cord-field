import { ValidatorFn } from '@angular/forms';
import { validatePair } from './helpers';

export function passwordMatch(passwordFieldName = 'password', confirmFieldName = 'confirmPassword'): ValidatorFn {
  return validatePair<string>(passwordFieldName, confirmFieldName, 'passwordMismatched', (a, b) => a === b);
}
