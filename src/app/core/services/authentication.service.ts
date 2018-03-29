import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthenticationToken } from '../models/authentication-token';
import { User } from '../models/user';
import { AuthenticationStorageService } from './authentication-storage.service';
import { IApiServiceOptions } from './http/abstract-http-client';
import { ProfileApiService } from './http/profile-api.service';
import { LoggerService } from './logger.service';

@Injectable()
export class AuthenticationService {

  private _login$ = new Subject<AuthenticationToken[]>();
  private _logout$ = new Subject<void>();

  get login$(): Observable<AuthenticationToken[]> {
    return this._login$.asObservable();
  }

  get logout$(): Observable<void> {
    return this._logout$.asObservable();
  }

  // get loggedIn(): boolean {
  //   const tokens = this.authStorage.getAuthenticationTokens();
  //   if (!tokens || tokens.length === 0) {
  //     return false;
  //   }
  //
  //   for (const token of tokens) {
  //     if (token.expired) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // get currentUser(): User {
  //   const tokens = this.authStorage.getAuthenticationTokens();
  //   if (tokens && tokens.length > 0) {
  //     return tokens[0].toUser();
  //   }
  // }

  constructor(private api: ProfileApiService,
              private authStorage: AuthenticationStorageService,
              private log: LoggerService) {
    // api.source = this;
  }

  //
  // changePassword(email: string, currentPassword: string, newPassword: string): Observable<Response> {
  //   return this
  //     .api
  //     .put('/auth/native/change-password', {
  //       email,
  //       currentPassword,
  //       newPassword
  //     });
  // }
  //
  // forgotPassword(email: string): Observable<Response> {
  //   return this
  //     .api
  //     .put('/auth/native/forgot-password', {email});
  // }
  //
  // resetPassword(confirmationToken: string, newPassword: any): Observable<Response> {
  //   return this
  //     .api
  //     .put(`/auth/native/reset-password/${confirmationToken}`, newPassword);
  // }
  //
  // confirmEmail(confirmationToken: string): Observable<Response> {
  //   return this
  //     .api
  //     .get(`/auth/native/confirm/${confirmationToken}`);
  // }
  //
  // resendEmailConfirmation(email: string): Observable<Response> {
  //   return this
  //     .api
  //     .post('/auth/native/confirm', {email});
  // }

  // login(email: string, password: string, rememberLogin: boolean): Observable<AuthenticationToken[]> {
  //   const body = {
  //     email,
  //     password
  //   };
  //
  //   const reqOptions: IApiServiceOptions = {
  //     disableServerDown: true
  //   };
  //
  //   return this
  //     .api
  //     .post('/auth/native/login', body, {}, reqOptions)
  //     .map((res: Response) => res)
  //     .map((json: any) => AuthenticationToken.fromTokenMap(json))
  //     .do((tokens: AuthenticationToken[]) => this.authStorage.saveTokens(tokens, rememberLogin))
  //     .do((tokens: AuthenticationToken[]) => this._login$.next(tokens));
  // }

  logout(): Observable<void> {
    this.authStorage.clearTokens();
    this._logout$.next();
    return Observable.of(null);
  }
}
