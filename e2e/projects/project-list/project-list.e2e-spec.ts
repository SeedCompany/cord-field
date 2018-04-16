import { CordNagivation } from '../../utils/nagivation';
import { ProjectListPage } from './project-list.po';

describe('cord-field projects list', () => {
  let projectListPage: ProjectListPage;
  let cordNav: CordNagivation;

  beforeEach(() => {
    projectListPage = new ProjectList();
    cordNav = new CordNagivation();
    cordNav.navigateToRoot();
  });

  it('title should match', async(done) => {
    expect(projectListPage.getTitleInHeader()).toEqual('Cord Field');
    done();
  });
});

