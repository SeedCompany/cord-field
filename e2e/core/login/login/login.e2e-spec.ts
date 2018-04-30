import { browser } from 'protractor';
import { CordNagivation } from '../../../utils/nagivation';
import { Login } from './login.po';

describe('cord-field Login screen', () => {
  let loginPage: Login;
  let cordNav: CordNagivation;

  beforeEach(() => {
    loginPage = new Login();
    cordNav = new CordNagivation();
    cordNav.navigateToLogin();
    // TODO: JIRA ticket CF2-259 -> add code to bring Chrome window to front to avoid intermittent failures
  });

  it('search for title in login screen', () => {
    const loginTitle = loginPage.getTitle();
    expect(loginTitle.getText()).toEqual('Sign In');
  });

  it('find and click the SIGN IN button', () => {
    const button = loginPage.getSignInButton();
    expect(button.getText()).toEqual(('SIGN IN'));
  });

  it('find and click the FORGOT EMAIL/PASSWORD? button', async () => {
    const button = loginPage.getForgotLoginButton();
    expect(button.getText()).toEqual(('FORGOT EMAIL/PASSWORD?'));
    await button.isEnabled();
    await button.click();
  });

  it('find and click the REQUEST ACCESS button', async () => {
    const button = loginPage.getRequestAccessButton();
    expect(button.getText()).toEqual(('REQUEST ACCESS'));
    await button.isEnabled();
    await button.click();
  });

  it('enter email and password and click sign in', async () => {
    loginPage.getFormInputControl('email').sendKeys('rick_maclean@tsco.org');
    loginPage.getFormInputControl('password').sendKeys('test');
    const button = loginPage.getSignInButton();
    expect(button.getText()).toEqual(('SIGN IN'));
    await button.isEnabled();
    await button.click();
    await browser.waitForAngularEnabled();
    await cordNav.navigateToRoot();
    await cordNav.navigateToProjects();
    await cordNav.navigateToTasks();
    await cordNav.navigateToPeople();
    await cordNav.navigateToLanguages();
    await cordNav.navigateToOrganizations();
  });
});


