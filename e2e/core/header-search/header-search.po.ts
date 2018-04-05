import { browser, by, element } from 'protractor';

const byMatIcon = (name: string) => by.xpath(`//mat-icon[. = '${name}']`);

export class HeaderSearch {
  navigateTo() {
    return browser.get('/');
  }

  getSearchInput2() {
    const searchInput = element(by.model('value'));
    return searchInput;
  }

  getSearchIcon() {
    return element(by.tagName('app-header')).element(byMatIcon('search'));
  }

  getSearchInput() {
    const searchInput = element(by.tagName('app-header')).element(by.tagName('input'));
    return searchInput;
  }
}

// <input _ngcontent-c5="" autofocus="" class="mat-input-element mat-form-field-autofill-control ng-tns-c5-0 ng-valid ng-dirty ng-touched"
// matinput="" placeholder="Search" type="text" ng-reflect-model="Jumpity jumpity umpisty" ng-reflect-placeholder="Search"
// ng-reflect-type="text" id="mat-input-0" aria-invalid="false" aria-required="false">
