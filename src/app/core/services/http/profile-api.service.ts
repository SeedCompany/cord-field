import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { BaseApiService } from './base-api';

export const SERVICE_AUDIENCE = 'profile.illuminations.bible';

@Injectable()
export class ProfileApiService extends BaseApiService {

  constructor(authStorage: AuthenticationStorageService, httpClient: HttpClient) {
    super(authStorage, SERVICE_AUDIENCE, httpClient);
  }
}
