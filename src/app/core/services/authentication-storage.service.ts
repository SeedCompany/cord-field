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

  private authTokens: AuthenticationToken[];

  constructor(private localStore: LocalStorageService,
              private sessionStore: SessionStorageService,
              private log: LoggerService) {
  }

  getAuthenticationTokens(): AuthenticationToken[] {
    if (!this.authTokens) {
      const tokensFromLocalDb = this.localStore.getItem(AUTH_STORAGE_KEY) || this.sessionStore.getItem(AUTH_STORAGE_KEY)
      tokensFromLocalDb
        .toPromise()
        .then((tokens: AuthenticationToken[]) => {
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
          this.authTokens = tokens;
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
