import { browser } from 'protractor';

export class CordNagivation {
  navigateToTab(name: string) {
    return browser.get('/' + name);
  }

  navigateToRoot() {
    return browser.get('/');
  }

  navigateToLogin() {
    this.navigateToTab('login');
  }

  navigateToProjects() {
    this.navigateToTab('projects');
  }

  navigateToTasks() {
    this.navigateToTab('tasks');
  }

  navigateToLanguages() {
    this.navigateToTab('languages');
  }

  navigateToPeople() {
    this.navigateToTab('people');
  }

  navigateToOrganizations() {
    this.navigateToTab('organizations');
  }
}
