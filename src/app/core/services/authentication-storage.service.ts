import { Injectable } from '@angular/core';
import { AuthenticationToken } from '../models/authentication-token';
import { LoggerService } from './logger.service';
import { LocalStorageService, SessionStorageService } from './storage.service';

export const AUTH_STORAGE_KEY = 'ilb_auth';

/**
 * Stores and retrieves AuthenticationTokens from Session or Local Storage
 */
@Injectable()
export class AuthenticationStorageService {

  private authTokens: any[];

  private authToken: AuthenticationToken;

  constructor(private localStore: LocalStorageService,
              private sessionStore: SessionStorageService,
              private log: LoggerService) {
  }

  // getAuthenticationToken(service: string): AuthenticationToken {
  //
  //   if (!this.authToken) {
  //
  //     const tokensJson = (this.localStore.getItem(AUTH_STORAGE_KEY) || this.sessionStore.getItem(AUTH_STORAGE_KEY));
  //
  //     tokensJson
  //       .toPromise()
  //       .then((tokens) => {
  //         if (!tokens) {
  //           return null;
  //         }
  //         try {
  //           if (!Array.isArray(tokens)) {
  //             this.log.error(new Error('stored tokens should have been in an array'));
  //           }
  //         } catch (err) {
  //           this.log.info(err, 'stored auth tokens are corrupted... deleting them from the store');
  //           this.clearTokens();
  //           return null;
  //         }
  //         for (const token of tokens) {
  //           if (token.key === service) {
  //             return AuthenticationToken.fromJson(token);
  //           }
  //         }
  //         return null;
  //       })
  //       .catch(Promise.reject);
  //   }
  //
  //   return this.authToken;
  // }

  getAuthenticationTokens(): AuthenticationToken[] {

    if (!this.authTokens) {
      const tokensJson = (this.localStore.getItem(AUTH_STORAGE_KEY) || this.sessionStore.getItem(AUTH_STORAGE_KEY));
      tokensJson
        .toPromise()
        .then((tokens) => {
          if (!tokens) {
            return null;
          }
          try {
            if (!Array.isArray(tokens)) {
              this.log.error(new Error('stored tokens should have been in an array'));
            }
          } catch (err) {
            this.log.info(err, 'stored auth tokens are corrupted... deleting them from the store');
            this.clearTokens();
            return null;
          }
          return this.authTokens;

        })
        .catch(Promise.reject);
    }
    return this.authTokens;
  }

  saveTokens(tokens: AuthenticationToken[], remember: boolean) {
    this.clearTokens();
    const store = (remember) ? this.localStore : this.sessionStore;
    store.setItem(AUTH_STORAGE_KEY, tokens);
  }

  clearTokens() {
    this.sessionStore.removeItem(AUTH_STORAGE_KEY);
    this.localStore.removeItem(AUTH_STORAGE_KEY);
  }
}
