import { CordNagivation } from '../../../utils/nagivation';
import { RequestAccessPage } from './request-access.po';

describe('cord-field Login screen then request access', () => {
  let requestAccessPage: RequestAccessPage;
  let cordNav: CordNagivation;

  beforeEach(() => {
    requestAccessPage = new RequestAccessPage();
    cordNav = new CordNagivation();
    cordNav.navigateToRoot();
  });

  it('find and click the REQUEST ACCESS button', async(done) => {
    let button = requestAccessPage.getRequestAccessButton();
    expect(button.getText()).toEqual(('REQUEST ACCESS'));
    await button.click();
    requestAccessPage.getInputFirstName().sendKeys('FirstNameoh ya ya ya ya ya ');
    requestAccessPage.getInputLastName().sendKeys('LLLLLLLLLLLLLLLASTNameoh ya ya ya ya ya ');
    requestAccessPage.getInputEmail().sendKeys('dkfkheisihfifesdfkh@tsco.com');
    requestAccessPage.getInputOrg().sendKeys('org ORG ord org ORG ord org ORG ord org ORG ord org ORG ord org ORG ord ');
    requestAccessPage.getInputPassword().sendKeys('dblikityBokityBlakitikinotogobonga');
    requestAccessPage.getInputConfirmPassword().sendKeys('dblikityBokityBlakitikinotogobonga');
    await requestAccessPage.getInputEmail().clear();
    requestAccessPage.getInputEmail().sendKeys('shonRing@tsco.com');
    button = requestAccessPage.getCancelButton();
    expect(button.getText()).toEqual(('CANCEL'));
    await button.click();
    button = await requestAccessPage.getRequestAccessButton();
    expect(button.getText()).toEqual(('REQUEST ACCESS'));
    done();
  });
});
