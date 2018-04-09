import { browser, ExpectedConditions } from 'protractor';
import { HeaderSearch } from './header-search.po';

describe('cord-field App', () => {
  let headerSearch: HeaderSearch;

  beforeEach(() => {
    headerSearch = new HeaderSearch();
  });

  afterEach( () => {
  });

  it ( 'click search icon and enter text', () => {
    headerSearch.navigateTo();
    headerSearch.getSearchIcon().click();
    browser.wait(ExpectedConditions.visibilityOf(headerSearch.getSearchInput()), 10000);
    const searchInput = headerSearch.getSearchInput();
    searchInput.sendKeys('type something to search..........00000000..........=+=+=........................searcj searh learn to spell...');
  });

});

