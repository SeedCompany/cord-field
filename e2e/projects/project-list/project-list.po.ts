import { browser, by, element } from 'protractor';

export class ProjectList {
  navigateTo() {
    return browser.get('/projects');
  }

  getTitleInHeader() {
    return browser.getTitle();
  }

  getAppProjectsButton() {
    return element(by.partialButtonText('All Projects'));
  }
}

