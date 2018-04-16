import { browser, by, element } from 'protractor';
import { byMatIcon } from '../../utils/locators';

export class HeaderSearch {
  navigateTo() {
    return browser.get('/');
  }

  getSearchIcon() {
    return element(by.tagName('app-header')).element(byMatIcon('search'));
  }

  getSearchInput() {
    return element(by.tagName('app-header')).element(by.tagName('input'));
  }
}
