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

const domain = environment.domain;

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

  login(email: string, password: string, rememberLogin: boolean): Observable<AuthenticationToken[]> {
    return this
      .api
      .post('/auth/native/login', {domain, email, password})
      .map((json) => AuthenticationToken.fromTokenMap(json))
      .do(async (tokens: AuthenticationToken[]) => await this.authStorage.saveTokens(tokens, rememberLogin))
      .do((tokens: AuthenticationToken[]) => this._login.next(tokens));
  }

  async logout(): Promise<void> {
    await this.authStorage.clearTokens();
    this._logout.next();
  }

  getErrorMessage(error: HttpErrorResponse): string {
    // error messages needs tobe more verbose after discussion with team.
    let errMsg = '';
    const serverError = error.error;

    switch (error.status) {
      case 400:
        if (serverError && serverError.feedback) {
          const errorString = 'Invalid Password.';
          const warning = serverError.feedback.warning;
          serverError.feedback.suggestions.forEach((suggestion) => {
            errMsg += suggestion;
          });

          return errorString + warning + '\n' + errMsg;
        }
        errMsg = 'Something went wrong with the system, Please try after some time';
        break;
      case 401:
        errMsg = 'You entered wrong email or password';
        break;
      case 403:
        errMsg = serverError;
        break;
      case 404:
        errMsg = serverError;
        break;
      case 409:
        errMsg = serverError;
        break;
      case 422:
        errMsg = serverError;
        break;
      case 500:
        errMsg = serverError;
        break;
      case 503:
        errMsg = 'Your requested service is not available';
        break;
    }

    return errMsg;
  }
}
