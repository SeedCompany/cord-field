import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BaseApiService } from './base-api';

export const SERVICE_AUDIENCE = 'profile.illuminations.bible';

@Injectable()
export class ProfileApiService extends BaseApiService {

  constructor(http: HttpClient) {
    super(http, SERVICE_AUDIENCE);

    if (!environment.services || !environment.services[SERVICE_AUDIENCE]) {
      throw new Error(`environment.services is misconfigured for profile server, expecting key ${SERVICE_AUDIENCE}`);
    }
  }
}
