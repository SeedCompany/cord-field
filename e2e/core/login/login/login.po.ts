import { browser, by, element } from 'protractor';
import { ProtractorLocators } from '../../../utils/locators';

export class Login {
  cordLocator = new ProtractorLocators();

  navigateTo() {
    return browser.get('/');
  }

  navigateToTab(name: string) {
    return browser.get('/' + name);
  }

  getTitle() {
    return element(by.tagName('mat-card')).element(this.cordLocator.byCardTitle());
  }

  getSignInButton() {
    return element(by.partialButtonText('SIGN IN'));
  }

  getForgotLoginButton() {
    return element(by.partialButtonText('FORGOT EMAIL/PASSWORD?'));
  }

  getRequestAccessButton() {
    return element(by.partialButtonText('REQUEST ACCESS'));
  }

  getFormInputControl(formControlName: string) {
    return element(this.cordLocator.byFormControlName(formControlName));
  }
}

