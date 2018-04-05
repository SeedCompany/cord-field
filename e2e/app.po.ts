import { browser, by, element } from 'protractor';

export class AppPage {
  takeMeHomeButton() {
    const button1 = element(by.cssContainingText('[class="mat-button-wrapper"]', 'Take Me Home'));
    return button1;
  }

  navigateTo() {
    return browser.get('/');
  }

  navigateToPageNotFound() {
    return browser.get('/blat');
  }

  navigateToProjects() {
    return browser.get('/projects');
  }

  navigateToTasks() {
    return browser.get('/tasks');
  }

  navigateToLanguages() {
    return browser.get('/languages');
  }

  navigateToPeople() {
    return browser.get('/people');
  }

  navigateToOrganizations() {
    return browser.get('/organizations');
  }

  getSearchIcon() {
    return element(by.className('mat-button-wrapper'));
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getTitleInHeader() {
    return browser.getTitle();
  }

  getFirstLink() {
    return element(by.className('mat-list-item-content'));
  }

  getAllLinks() {
    const allLinks = element.all(by.className('mat-nav-list'));
    return allLinks;
  }

  getWelcomeMessage() {
    return element(by.className('mat-display-1'));
  }

  getLinksTitle() {
    return element(by.xpath('//div[@class=\'mat-title\']'));
  }
}
