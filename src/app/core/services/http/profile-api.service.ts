import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { LoggerService } from '../logger.service';
import { BaseApiService } from './base-api';

export const SERVICE_AUDIENCE = 'profile.illuminations.bible';

@Injectable()
export class ProfileApiService extends BaseApiService {

  constructor(authStorage: AuthenticationStorageService,
              http: HttpClient,
              log: LoggerService) {

    if (!environment.services || !environment.services[SERVICE_AUDIENCE]) {
      throw new Error(`environment.services is misconfigured for ProfileApiService, expecting key ${SERVICE_AUDIENCE}`);
    }

    super(http, SERVICE_AUDIENCE);
  }
}
