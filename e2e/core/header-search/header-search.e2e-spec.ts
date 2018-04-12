  import { HeaderSearch } from './header-search.po';

describe('cord-field header search', () => {
  let headerSearch: HeaderSearch;

  beforeEach(() => {
    headerSearch = new HeaderSearch();
  });

  it('click search icon and enter text', async(done) => {
    headerSearch.navigateTo();
    const button = headerSearch.getSearchIcon();
    await button.isEnabled();
    await button.click();
    const searchInput = headerSearch.getSearchInput();
    await searchInput.isDisplayed();
    await searchInput.sendKeys('type something to search..........00000000..........=+=+=..................searcj searh learn to spell...');
    done();
  });
});

