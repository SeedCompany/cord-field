import { browser, by, element } from 'protractor';
import { ProtractorLocators } from '../../utils/locators';

export class HeaderSearch {
  protLocator = new ProtractorLocators();

  navigateTo() {
    return browser.get('/');
  }

  getSearchIcon() {
    return element(by.tagName('app-header')).element(this.protLocator.byMatIcon('search'));
  }

  getSearchInput() {
    return element(by.tagName('app-header')).element(by.tagName('input'));
  }
}
