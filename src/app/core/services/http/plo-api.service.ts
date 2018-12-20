import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { BaseApiService } from './base-api';

export const SERVICE_AUDIENCE = 'plo.cord.bible';

@Injectable({
  providedIn: 'root',
})
export class PloApiService extends BaseApiService {

  constructor(authStorage: AuthenticationStorageService, httpClient: HttpClient) {
    super(authStorage, SERVICE_AUDIENCE, httpClient);
  }
}
