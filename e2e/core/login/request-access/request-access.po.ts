import { browser, by, element } from 'protractor';
import { ProtractorLocators } from '../../../utils/locators';

export class RequestAccessPage {
  cordLocator = new ProtractorLocators();

  navigateTo() {
    return browser.get('/login');
  }

  getRequestAccessButton() {
    return element(by.partialButtonText('REQUEST ACCESS'));
  }

  getCancelButton() {
    return element(by.partialButtonText('CANCEL'));
  }

  getFormInputControl(formControlName: string) {
    return element(this.cordLocator.byFormControlName(formControlName));
  }

  getInputFirstName () {
    return element(by.css('input[formControlName="firstName"]'));
  }

  getInputLastName () {
    return element(by.css('input[formControlName="lastName"]'));
  }

  getInputEmail () {
    return element(by.css('input[formControlName="email"]'));
  }

  getInputOrg () {
    return element(by.css('input[formControlName="organization"]'));
  }

  getInputPassword () {
    return element(by.css('input[formControlName="password"]'));
  }

  getInputConfirmPassword () {
    return element(by.css('input[formControlName="confirmPassword"]'));
  }

}
