import { by, element } from 'protractor';
import { Login } from './login.po';

describe('cord-field Login screen', () => {
  let loginPage: Login;

  beforeEach(() => {
    loginPage = new Login();
  });

  afterEach( () => {
  });

  it ( 'search for title in login screen', () => {
    loginPage.navigateTo();
    const loginTitle = loginPage.getTitle();
    expect(loginTitle.getText()).toEqual('Sign In');
  });

});


