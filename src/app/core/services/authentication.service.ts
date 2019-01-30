import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationToken } from '../models/authentication-token';
import { User } from '../models/user';
import { AuthenticationStorageService } from './authentication-storage.service';
import { IGNORE_AUTH_ERRORS } from './http/auth-interceptor';
import { PloApiService } from './http/plo-api.service';
import { SessionStorageService } from './storage.service';

const DOMAIN = 'field';

interface InvalidPasswordResponse {
  code: 400;
  error: 'invalid_password';
  feedback: {
    warning: string; // Can be empty string
    suggestions: string[]; // Can be empty list
  };
}

export function isInvalidPasswordError(error: any): error is InvalidPasswordResponse {
  return error.error === 'invalid_password';
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

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

  /**
   * Throws:
   * - login_failed
   * - email_validation_required
   * - internal_server_error
   * - account_not_approved
   * - reset_password_required?
   * - invalid_password - insecure new password
   */
  async login(email: string, password: string, rememberLogin: boolean, newPassword?: string): Promise<void> {
    email = email.toLowerCase();
    const tokens = await this.api
      .post('/auth/native/login', {domain: DOMAIN, email, password, newPassword}, {
        headers: {[IGNORE_AUTH_ERRORS]: 'true'},
      })
      .pipe(map(AuthenticationToken.fromTokenMap))
      .toPromise();

    await this.authStorage.saveTokens(tokens, rememberLogin);
  }

  async logout(): Promise<void> {
    await this.authStorage.clearTokens();
  }

  /**
   * Throws:
   * - invalid_token
   * - internal_server_error
   */
  async confirmEmail(confirmationToken: string): Promise<Object> {
    return this.api.get(`/auth/native/confirm/${confirmationToken}`).toPromise();
  }

  async forgotPassword(email: string): Promise<void> {
    email = email.toLowerCase();
    await this.api.put('/auth/native/forgot-password', {email, domain: DOMAIN}).toPromise();
  }

  /**
   * Throws:
   * - invalid_token
   * - invalid_password
   * - internal_server_error
   */
  async resetPassword(confirmationToken: string, newPassword: string): Promise<void> {
    await this.api.put(`/auth/native/reset-password/${confirmationToken}`, {password: newPassword, domain: DOMAIN}).toPromise();
  }

  /**
   * Throws:
   * - unauthorized - when user not found or password doesn't match
   */
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    email = email.toLowerCase();
    await this.api.put('/auth/native/change-password', {email, currentPassword, newPassword}, {
      headers: {[IGNORE_AUTH_ERRORS]: 'true'},
    }).toPromise();
  }
}
