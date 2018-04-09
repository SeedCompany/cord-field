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

const domain = environment.services['domain'];

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
    api.source = this;
  }

  requestAccess(newUser: IUserRequestAccess): Observable<void> {
    const body = newUser;
    return this
      .api
      .post('/users/request-account', {body});

  }

  login(email: string, password: string, rememberLogin: boolean): Observable<AuthenticationToken[]> {
    const body = {
      domain,
      email: email,
      password: password
    };

    return this
      .api
      .post('/auth/native/login', {body})
      .map((json) => AuthenticationToken.fromTokenMap(json))
      .do(async (tokens: AuthenticationToken[]) => await this.authStorage.saveTokens(tokens, rememberLogin))
      .do((tokens: AuthenticationToken[]) => this._login.next(tokens));
  }

  async logout(): Promise<void> {
    await this.authStorage.clearTokens();
    this._logout.next();
  }
}
