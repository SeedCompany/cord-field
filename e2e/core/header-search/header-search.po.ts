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

// <input _ngcontent-c5="" autofocus="" class="mat-input-element mat-form-field-autofill-control ng-tns-c5-0 ng-valid ng-dirty ng-touched"
// matinput="" placeholder="Search" type="text" ng-reflect-model="Jumpity jumpity umpisty" ng-reflect-placeholder="Search"
// ng-reflect-type="text" id="mat-input-0" aria-invalid="false" aria-required="false">
