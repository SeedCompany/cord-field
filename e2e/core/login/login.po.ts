import { browser, by, element } from 'protractor';
import { ProtractorLocators } from '../../utils/locators';

export class Login {
  protLocator = new ProtractorLocators();

  navigateTo() {
    return browser.get('/');
  }

  getTitle() {
    return element(by.tagName('mat-card')).element(this.protLocator.byCardTitle());
  }
}
