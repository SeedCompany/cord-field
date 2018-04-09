import { browser, by, element } from 'protractor';
import { ProjectList } from './project-list.po';

describe('cord-field App', () => {
  let projectListPage: ProjectList;

  beforeEach(() => {
    projectListPage = new ProjectList();
    browser.waitForAngularEnabled(true);
    projectListPage.navigateTo();
  });

  afterEach( () => {
  });

  it ( 'title should match', () => {
    expect(projectListPage.getTitleInHeader()).toEqual('Cord Field');
  });

  it ( 'navigate to project list and find All Projects button', () => {
    const buttonTxt = projectListPage.getAppProjectsButton().getText();
    expect(buttonTxt).toEqual(('All Projects arrow_drop_down'));
  });

});

