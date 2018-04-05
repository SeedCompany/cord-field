import { forEach } from '@angular/router/src/utils/collection';
import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

describe('cord-field App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.waitForAngularEnabled(true);
  });

  it ( 'title should match', () => {
    page.navigateTo();
    console.log(page.getTitleInHeader());
    expect(page.getTitleInHeader()).toEqual('Cord Field');
  });

  it ( 'get link to click', () => {
    page.navigateTo();
    const firstLink = page.getFirstLink();
    firstLink.click();
    // expect(page.getFirstLink().getText).toEqual('Tour of Heroes');
    browser.getAllWindowHandles().then(function (handles) {
      // We currently are on the second tab...
      browser.switchTo().window(handles[0]);
    });
  });

  it ( 'click all links', () => {
    page.navigateTo();
    const lastLink = page.getAllLinks().last();
    lastLink.click();
    browser.getAllWindowHandles().then(function (handles) {
      // We currently are on the second tab...
      browser.switchTo().window(handles[0]);
    });
    /*
    const links = page.getAllLinks();
    for (let i = 0; i < links.length; ++i) {
      links.get(i).click();
      page.navigateTo();
      console.log(links);
    }
    */
  });

  it ( 'get welcome message', () => {
    page.navigateTo();
    expect(page.getWelcomeMessage().getText()).toEqual('Welcome to Cord Field!');
  });

  it ( 'navigate to page not found', () => {
    // page.navigateToPageNotFound();
    page.navigateToPageNotFound();
    browser.wait(function() {
      return page.takeMeHomeButton().isPresent();
    }, 5000);
    page.takeMeHomeButton().click();
    expect(page.getLinksTitle().getText()).toEqual('Here are some links to help you start:');
    const firstLink = page.getFirstLink();
    expect(firstLink.isEnabled()).toBe(true);
  });

  it ( 'navigate to all tabs', () => {
    // page.navigateToPageNotFound();
    page.navigateToProjects();
    page.getSearchIcon().click();
    page.navigateToTasks();
    page.getSearchIcon().click();
    page.navigateToLanguages();
    page.getSearchIcon().click();
    page.navigateToPeople();
    page.getSearchIcon().click();
    page.getSearchIcon().click();
    page.navigateToOrganizations();
  });

  it ( 'navigate search icon', () => {
    page.getSearchIcon().click();
  });

  it ( 'get links title', () => {
    page.navigateTo();
    expect(page.getLinksTitle().getText()).toEqual('Here are some links to help you start:');
  });

});
