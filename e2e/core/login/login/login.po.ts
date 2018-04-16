import { by, element } from 'protractor';
import { byCardTitle, byFormControlName } from '../../../utils/locators';

export class Login {
  getTitle() {
    return element(by.tagName('mat-card')).element(byCardTitle());
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
    return element(byFormControlName(formControlName));
  }
}

