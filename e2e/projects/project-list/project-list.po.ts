import { browser, by, element } from 'protractor';

export class ProjectList {
  navigateTo() {
    return browser.get('/');
  }

  navigateToProjectList() {
    return browser.get('/projects');
  }

  getTitleInHeader() {
    return browser.getTitle();
  }

  getAppProjectsButton() {
    const projsBtn = element(by.partialButtonText('All Projects'));
    return projsBtn;
  }
}

