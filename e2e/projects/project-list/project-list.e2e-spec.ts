import { browser, by, element } from 'protractor';
import { ProjectList } from './project-list.po';

describe('cord-field App', () => {
  let page: ProjectList;

  beforeEach(() => {
    page = new ProjectList();
    browser.waitForAngularEnabled(true);
  });

  afterEach( () => {
    page.navigateTo();
  });

  it ( 'title should match', () => {
    page.navigateTo();
    console.log(page.getTitleInHeader());
    expect(page.getTitleInHeader()).toEqual('Cord Field');
  });

  it ( 'navigate to project list and find All Projects button', () => {
    page.navigateToProjectList();
    const buttonTxt = page.getAppProjectsButton().getText();
    expect(buttonTxt).toEqual(('All Projects arrow_drop_down'));
  });

});

