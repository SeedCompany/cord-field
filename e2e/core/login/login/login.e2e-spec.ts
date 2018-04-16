import { browser } from 'protractor';
import { Login } from './login.po';

describe('cord-field Login screen', () => {
  let loginPage: Login;

  beforeEach(() => {
    loginPage = new Login();
    loginPage.navigateTo();
    // TODO: add code to bring Chrome window to front to avoid intermittent failures
  });

  it('search for title in login screen', async(done) => {
    const loginTitle = loginPage.getTitle();
    expect(loginTitle.getText()).toEqual('Sign In');
    done();
  });

  it('find and click the SIGN IN button', async(done) => {
    const button = loginPage.getSignInButton();
    expect(button.getText()).toEqual(('SIGN IN'));
    done();
  });

  it('find and click the FORGOT EMAIL/PASSWORD? button', async(done) => {
    const button = loginPage.getForgotLoginButton();
    expect(button.getText()).toEqual(('FORGOT EMAIL/PASSWORD?'));
    await button.isEnabled();
    await button.click();
    done();
  });

  it('find and click the REQUEST ACCESS button', async(done) => {
    const button = loginPage.getRequestAccessButton();
    expect(button.getText()).toEqual(('REQUEST ACCESS'));
    await button.isEnabled();
    await button.click();
    done();
  });

  it('enter email and password and click sign in', async(done) => {
    loginPage.getFormInputControl('email').sendKeys('rick_maclean@tsco.org');
    loginPage.getFormInputControl('password').sendKeys('test');
    const button = loginPage.getSignInButton();
    expect(button.getText()).toEqual(('SIGN IN'));
    await button.isEnabled();
    await button.click();
    await browser.waitForAngularEnabled();
    await loginPage.navigateTo();
    await loginPage.navigateToTab('projects');
    await loginPage.navigateToTab('tasks');
    await loginPage.navigateToTab('languages');
    await loginPage.navigateToTab('people');
    await loginPage.navigateToTab('organizations');
    done();
  });
});


