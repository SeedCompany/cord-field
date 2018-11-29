import { Injectable } from '@angular/core';
import { AuthenticationToken } from '../models/authentication-token';
import { LoggerService } from './logger.service';
import {
  LocalStorageService,
  SessionStorageService,
} from './storage.service';

export const AUTH_STORAGE_KEY = 'auth';

/**
 * Stores and retrieves AuthenticationTokens from Session or Local Storage
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationStorageService {

  private tokens: AuthenticationToken[] | null;

  constructor(private localStore: LocalStorageService,
              private sessionStore: SessionStorageService,
              private log: LoggerService) {
  }

  async getAuthenticationToken(service: string): Promise<AuthenticationToken | null> {
    const tokens = await this.getAuthenticationTokens();
    if (!tokens) {
      return null;
    }

    return tokens.find(token => token.key === service) || null;
  }

  async getAuthenticationTokens(): Promise<AuthenticationToken[] | null> {
    if (this.tokens) {
      return this.tokens;
    }

    let tokens = await this.localStore.getItem<AuthenticationToken[]>(AUTH_STORAGE_KEY)
      || await this.sessionStore.getItem<AuthenticationToken[]>(AUTH_STORAGE_KEY);

    if (!tokens) {
      return null;
    }
    if (!Array.isArray(tokens)) {
      this.log.info('stored tokens should have been in an array');
      this.log.info('stored auth tokens are corrupted... deleting them from the store');
      await this.clearTokens();
      return null;
    }

    try {
      tokens = tokens.map(AuthenticationToken.fromJson);
    } catch (e) {
      this.log.warn('Error unserializing authentications tokens from store');
      await this.clearTokens();
      return null;
    }

    this.tokens = tokens;

    return tokens;
  }

  async saveTokens(tokens: AuthenticationToken[], remember: boolean): Promise<void> {
    await this.clearTokens();
    const store = (remember) ? this.localStore : this.sessionStore;
    await store.setItem(AUTH_STORAGE_KEY, tokens);
    this.tokens = tokens;
  }

  async clearTokens(): Promise<void> {
    await this.sessionStore.removeItem(AUTH_STORAGE_KEY);
    await this.localStore.removeItem(AUTH_STORAGE_KEY);
    this.tokens = null;
  }
}
