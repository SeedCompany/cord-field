import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static async email(control: AbstractControl) {
    const regx = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
    return regx.test(control.value) ? null : {invalidEmail: true};
  }
}
