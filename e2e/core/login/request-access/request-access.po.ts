import { by, element } from 'protractor';
import { byFormControlName } from '../../../utils/locators';

export class RequestAccessPage {
  getCancelButton() {
    return element(by.partialButtonText('CANCEL'));
  }

  getInputFirstName () {
    return element(byFormControlName('firstName'));
  }

  getInputLastName () {
    return element(byFormControlName('lastName'));
  }

  getInputEmail () {
    return element(byFormControlName('email'));
  }

  getInputOrg () {
    return element(byFormControlName('organization'));
  }

  getInputPassword () {
    return element(byFormControlName('password'));
  }

  getInputConfirmPassword () {
    return element(byFormControlName('confirmPassword'));
  }

  getRequestAccessButton() {
    return element(by.partialButtonText('REQUEST ACCESS'));
  }

}
