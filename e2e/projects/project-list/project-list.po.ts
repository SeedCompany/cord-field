import { browser, by, element } from 'protractor';

export class ProjectListPage {
  getTitleInHeader() {
    return browser.getTitle();
  }

  getAppProjectsButton() {
    return element(by.partialButtonText('All Projects'));
  }
}

