import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthenticationToken } from '../models/authentication-token';
import { IUserRequestAccess, User } from '../models/user';
import { AuthenticationStorageService } from './authentication-storage.service';
import { PloApiService } from './http/plo-api.service';
import { SessionStorageService } from './storage.service';

const DOMAIN = 'field';

@Injectable()
export class AuthenticationService {

  private _login = new Subject<AuthenticationToken[]>();
  private _logout = new Subject<void>();

  get login$(): Observable<AuthenticationToken[]> {
    return this._login.asObservable();
  }

  get logout$(): Observable<void> {
    return this._logout.asObservable();
  }

  async popNextUrl(): Promise<string | null> {
    const url = await this.sessionStorage.getItem<string>('nextUrl');
    if (url) {
      await this.setNextUrl(null);
    }
    return url;
  }

  async setNextUrl(url: string | null) {
    if (url) {
      await this.sessionStorage.setItem('nextUrl', url);
    } else {
      await this.sessionStorage.removeItem('nextUrl');
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const tokens = await this.authStorage.getAuthenticationTokens();
    return !(!tokens || tokens.length === 0 || tokens.find((t) => t.expired));
  }

  async getCurrentUser(): Promise<User | null> {
    const tokens = await this.authStorage.getAuthenticationTokens();
    return (tokens && tokens.length > 0)
      ? tokens[0].user
      : null;
  }

  constructor(private api: PloApiService,
              private authStorage: AuthenticationStorageService,
              private sessionStorage: SessionStorageService) {
  }

  async requestAccess(newUser: IUserRequestAccess) {
    try {
      await this.api.post('/users/request-account', {...newUser, domain: DOMAIN}).toPromise();
    } catch (err) {
      throw new Error(this.getErrorMessage(err));
    }
  }

  async login(email: string, password: string, rememberLogin: boolean): Promise<AuthenticationToken[]> {
    let json = {};
    try {
      json = await this.api.post('/auth/native/login', {domain: DOMAIN, email, password}).toPromise();
    } catch (err) {
      throw new Error(this.getErrorMessage(err));
    }

    const tokens = AuthenticationToken.fromTokenMap(json);
    await this.authStorage.saveTokens(tokens, rememberLogin);
    this._login.next(tokens);

    return tokens;
  }

  async logout(): Promise<void> {
    await this.authStorage.clearTokens();
    this._logout.next();
  }

  private getErrorMessage(response: HttpErrorResponse): string {
    switch (response.error.error) {
      case 'invalid_password':
        return 'Your password is too simple or is a known, commonly used password.' +
          'Strong passwords are generally longer; incorporate a mixture of letters, numbers & special characters;' +
          '& avoid common words. Please enter a new password.';
      case 'invalid_organization':
        return 'Your account request cannot be completed because the organization you provided is not valid.' +
          ' Please try again or contact Field Support Services for assistance.';
      case 'login_failed':
        return 'Email or password is incorrect';
      case 'email_validation_required':
        return 'Sorry, our system does not have any account with the credentials you provided. If you already created an account, ' +
          'please verify it by clicking on the link provided in the email you should have received.';
      case 'account_not_approved':
        return 'Your account is not approved yet. Please try again or contact Field Support Services for assistance.';
      case 'server_error':
        return 'server_error';
      case 'bad_request':
        return 'Oh noooooooo! Something went terribly wrong, Please try again later. ' +
          'If the problem continues, please contact Cord Field Support Services.';
      case 'invalid_token':
        return 'Weird, your token is invalid. If you copied the link emailed to you, make sure you got it exactly as it was' +
          ' sent. Please contact Cord Field Support Services.';
      case 'unauthorized':
        return 'Please input valid password.';
    }

    return 'Unknown error';
  }

  async confirmEmail(confirmationToken: string): Promise<Object | HttpErrorResponse> {
    return this.api.get(`/auth/native/confirm/${confirmationToken}`).toPromise();
  }

  async forgotPassword(email: string): Promise<void> {
    await this.api.put('/auth/native/forgot-password', {email: email, domain: DOMAIN}).toPromise();
  }

  async resetPassword(confirmationToken: string, newPassword: string): Promise<void> {
    try {
      await this.api.put(`/auth/native/reset-password/${confirmationToken}`, {password: newPassword, domain: DOMAIN}).toPromise();
    } catch (e) {
      throw new Error(this.getErrorMessage(e));
    }
  }

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.api.put('/auth/native/change-password', {
        email,
        currentPassword,
        newPassword
      }).toPromise();
    } catch (e) {
      throw new Error(this.getErrorMessage(e));
    }
  }
}
