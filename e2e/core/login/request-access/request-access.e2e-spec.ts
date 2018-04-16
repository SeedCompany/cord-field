import { browser } from 'protractor';
import { RequestAccessPage } from './request-access.po';

describe('cord-field Login screen then request access', () => {
  let requestAccessPage: RequestAccessPage;

  beforeEach(() => {
    requestAccessPage = new RequestAccessPage();
    requestAccessPage.navigateTo();
  });

  it('find and click the REQUEST ACCESS button', async(done) => {
    const button = requestAccessPage.getRequestAccessButton();
    expect(button.getText()).toEqual(('REQUEST ACCESS'));
    await button.click();
    let inputFld = requestAccessPage.getInputFirstName();
    inputFld.sendKeys('FirstNameoh ya ya ya ya ya ');
    inputFld = requestAccessPage.getInputLastName();
    inputFld.sendKeys('LLLLLLLLLLLLLLLASTNameoh ya ya ya ya ya ');
    inputFld = requestAccessPage.getInputLastName();
    inputFld.sendKeys('LLLLLLLLLLLLLLLASTNameoh ya ya ya ya ya ');
    inputFld = requestAccessPage.getInputEmail();
    inputFld.sendKeys('dkfkheisihfifesdfkh@tsco.com');
    inputFld = requestAccessPage.getInputOrg();
    inputFld.sendKeys('org ORG ord org ORG ord org ORG ord org ORG ord org ORG ord org ORG ord ');
    inputFld = requestAccessPage.getInputPassword();
    inputFld.sendKeys('dblikityBokityBlakitikinotogobonga');
    inputFld = requestAccessPage.getInputConfirmPassword();
    inputFld.sendKeys('dblikityBokityBlakitikinotogobonga');
    inputFld = requestAccessPage.getFormInputControl('firstName');
    inputFld.sendKeys('FirstNameoh ya ya ya ya ya FirstName');
    inputFld = requestAccessPage.getFormInputControl('lastName');
    inputFld.sendKeys('LastName');
    inputFld = requestAccessPage.getFormInputControl('email');
    await inputFld.clear();
    inputFld.sendKeys('shawnRing@tsco.com');
    inputFld = requestAccessPage.getFormInputControl('organization');
    await inputFld.clear();
    inputFld.sendKeys('organizationdkfjdflkdjfsdklfjsdlkfjdsfkdsfsdfjdssdfsdkjlfkjdslkf');
    await inputFld.clear();
    inputFld = requestAccessPage.getFormInputControl('password');
    await inputFld.clear();
    inputFld.sendKeys('testymessyblessycoolmanfromtheislesofMull');
    await inputFld.clear();
    inputFld = requestAccessPage.getFormInputControl('confirmPassword');
    await inputFld.clear();
    // sample of using console.log for debugging
    await inputFld.sendKeys('testymessyblessycoolmanfromtheisleofMull').then(() => console.log('confirmPassword async done'));
    button = requestAccessPage.getCancelButton();
    expect(button.getText()).toEqual(('CANCEL'));
    await button.click();
    button = await requestAccessPage.getRequestAccessButton();
    expect(button.getText()).toEqual(('REQUEST ACCESS'));
    // sample of using console.log for debugging
    const result = await browser.waitForAngularEnabled();
    console.log('is angular enabled');
    console.log(result);
    done();
  });
});
