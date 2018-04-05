import { browser, by, element, ExpectedConditions } from 'protractor';
import { HeaderSearch } from './header-search.po';

describe('cord-field App', () => {
  let headerSearch: HeaderSearch;

  beforeEach(() => {
    headerSearch = new HeaderSearch();
    // browser.waitForAngularEnabled(true);
  });

  afterEach( () => {
    // headerSearch.navigateTo();
  });

  it ( 'click search icon and enter text', () => {
    headerSearch.navigateTo();
    const EC = ExpectedConditions;
    /*
    browser.driver.wait(function () {
      browser.wait(EC.visibilityOf(headerSearch.getSearchIcon()), 10000);
      return headerSearch.getSearchIcon();
    });
    */
    browser.waitForAngular();
    const searchIcon = headerSearch.getSearchIcon();
    searchIcon.click();

    browser.driver.wait(function () {
      browser.wait(EC.visibilityOf(headerSearch.getSearchInput()), 10000);
      return headerSearch.getSearchInput();
    });
    const searchInput = headerSearch.getSearchInput();
    // browser.wait(EC.not(EC.visibilityOf(headerSearch.getSearchInput())));
    searchInput.sendKeys('type something to search.........................................................................................sksksksksksskskskskk...');
    // const searchInput2 = headerSearch.getSearchInput2();
    // searchInput2.sendKeys('this is entering text second time');

    // expect(headerSearch.getTitleInHeader()).toEqual('Cord Field');
  });

});

