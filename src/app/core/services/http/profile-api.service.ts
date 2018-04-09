import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api';

export const SERVICE_AUDIENCE = 'profile.illuminations.bible';

@Injectable()
export class ProfileApiService extends BaseApiService {

  constructor(http: HttpClient) {
    super(http, SERVICE_AUDIENCE);
  }
}
