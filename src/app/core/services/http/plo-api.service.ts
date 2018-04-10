import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api';

export const SERVICE_AUDIENCE = 'plo.cord.bible';

@Injectable()
export class PloApiService extends BaseApiService {

  constructor(httpClient: HttpClient) {
    super(httpClient, SERVICE_AUDIENCE);
  }
}
