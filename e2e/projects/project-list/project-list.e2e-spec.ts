import { ProjectList } from './project-list.po';

describe('cord-field projects list', () => {
  let projectListPage: ProjectList;

  beforeEach(() => {
    projectListPage = new ProjectList();
    projectListPage.navigateTo();
  });

  it('title should match', async(done) => {
    expect(projectListPage.getTitleInHeader()).toEqual('Cord Field');
    done();
  });

  it('navigate to project list and find All Projects button', async(done) => {
    const buttonTxt = projectListPage.getAppProjectsButton().getText();
    expect(buttonTxt).toEqual(('All Projects arrow_drop_down'));
    done();
  });
});

