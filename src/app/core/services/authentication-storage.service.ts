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

  constructor(private localStore: LocalStorageService,
              private sessionStore: SessionStorageService,
              private log: LoggerService) {
  }

  // getAuthenticationToken(service: string): AuthenticationToken {
  //   const tokensJson = (this.localStore.getItem(AUTH_STORAGE_KEY) || this.sessionStore.getItem(AUTH_STORAGE_KEY));
  //
  //   if (!tokensJson) {
  //     return null;
  //   }
  //
  //   let tokens;
  //   try {
  //     tokens = JSON.parse(tokensJson);
  //     if (!Array.isArray(tokens)) {
  //       this.log.error(new Error('stored tokens should have been in an array'));
  //     }
  //   } catch (err) {
  //     this.log.info(err, 'stored auth tokens are corrupted... deleting them from the store');
  //     this.clearTokens();
  //     return null;
  //   }
  //
  //   for (const token of tokens) {
  //     if (token.key === service) {
  //       return AuthenticationToken.fromJson(token);
  //     }
  //   }
  //
  //   return null;
  // }
  //
  // getAuthenticationTokens(): AuthenticationToken[] {
  //   const tokensJson = (this.localStore.getItem(AUTH_STORAGE_KEY) || this.sessionStore.getItem(AUTH_STORAGE_KEY));
  //
  //   if (!tokensJson) {
  //     return null;
  //   }
  //
  //   let tokens;
  //   try {
  //     tokens = JSON.parse(tokensJson);
  //     if (!Array.isArray(tokens)) {
  //       this.log.error(new Error('stored tokens should have been in an array'));
  //     }
  //   } catch (err) {
  //     this.log.info(err, 'stored auth tokens are corrupted... deleting them from the store');
  //     this.clearTokens();
  //     return null;
  //   }
  //
  //   return AuthenticationToken.fromJsonArray(tokens);
  // }

  saveTokens(tokens: AuthenticationToken[], remember: boolean) {
    this.clearTokens();
    const store = (remember) ? this.localStore : this.sessionStore;
    store.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
  }

  clearTokens() {
    this.sessionStore.removeItem(AUTH_STORAGE_KEY);
    this.localStore.removeItem(AUTH_STORAGE_KEY);
  }
}
