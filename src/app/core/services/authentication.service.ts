import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import { AuthenticationToken } from '../models/authentication-token';
import {
  IUserRequestAccess,
  User
} from '../models/user';
import { AuthenticationStorageService } from './authentication-storage.service';
import { ProfileApiService } from './http/profile-api.service';

const domain = environment['domain'];

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

  async isLoggedIn(): Promise<boolean> {
    const tokens = await this.authStorage.getAuthenticationTokens();
    return !(!tokens || tokens.length === 0 || tokens.find((t) => t.expired));
  }

  async getCurrentUser(): Promise<User | null> {
    const tokens = await this.authStorage.getAuthenticationTokens();
    return (tokens && tokens.length > 0)
      ? tokens[0].toUser()
      : null;
  }

  constructor(private api: ProfileApiService,
              private authStorage: AuthenticationStorageService) {
  }

  async requestAccess(newUser: IUserRequestAccess) {
    try {
      await this.api.post('/users/request-account', {...newUser, domain}).toPromise();
    } catch (err) {
      const error = this.getErrorMessage(err);
      throw new Error(error);
    }
  }

  async login(email: string, password: string, rememberLogin: boolean): Promise<AuthenticationToken[] | string> {

    return new Promise<AuthenticationToken[] | string>((resolve, reject) => {
      this
        .api
        .post('/auth/native/login', {domain, email, password})
        .map((json) => AuthenticationToken.fromTokenMap(json))
        .do(async (tokens: AuthenticationToken[]) => await this.authStorage.saveTokens(tokens, rememberLogin))
        .do((tokens: AuthenticationToken[]) => this._login.next(tokens))
        .toPromise()
        .then(resolve)
        .catch((err) => {
          const errors = this.getErrorMessage(err);
          reject(errors);
        });
    });
  }

  async logout(): Promise<void> {
    await this.authStorage.clearTokens();
    this._logout.next();
  }

  getErrorMessage(httpError: HttpErrorResponse): string {
    // error messages needs tobe more verbose after discussion with team.
    let errMsg, suggestions = '';
    const serverError = httpError.error;

    switch (httpError.status) {
      case 400:
        if (serverError.error && serverError.error === 'INVALID_PASSWORD') {
          if (serverError.feedback) {
            const errorString = 'Invalid Password.';
            const warning = serverError.feedback.warning;
            serverError.feedback.suggestions.forEach((suggestion) => {
              suggestions += suggestion;
            });
            errMsg = errorString + warning + '\n' + suggestions;
          }
        }
        if (serverError.error && serverError.error === 'INVALID_ORGANIZATION') {
          errMsg = 'Your account request cannot be completed because the organization you provided is not valid.' +
            ' Please try again or contact Field Support Services for assistance.';
        }
        break;
      case 401:
        if (serverError.error && serverError.error === 'login_failed') {
          errMsg = 'Email or Password is incorrect';
        }
        break;
      case 403:
        if (serverError.error && serverError.error === 'email_validation_required') {
          errMsg = 'Sorry, our system does not identify any account with the credentials you provided. If you already created as account' +
            'Please verify by clicking on the link provided in the email you received ';
        }
        if (serverError.error && serverError.error === 'ACCOUNT_NOT_APPROVED') {
          errMsg = 'Your account is not approved yet. Please try again or contact Field Support Services for assistance.';
        }
        break;
    }

    return errMsg;
  }
}
