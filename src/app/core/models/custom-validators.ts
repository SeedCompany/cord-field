export class CustomValidators {

  static isValidEmail(email): boolean {
    const regx = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
    return regx.test(email);
  }
}
