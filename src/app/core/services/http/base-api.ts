import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { AbstractHttpClient, IRequestOptionsWithBody } from './abstract-http-client';

export interface IApiServiceOptions {
  disableServerDown?: boolean;
}

export abstract class BaseApiService extends AbstractHttpClient {

  protected _baseUrl: string;
  source: any = {name: 'source not set'};

  get baseUrl(): string {
    return this._baseUrl;
  }

  debugApiCallLogger: (path: string, source: any, body: any, method: string) => void;

  constructor(httpClient: HttpClient, baseUrl: string) {
    super(httpClient);
    this._baseUrl = environment.services[baseUrl];
  }

  url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  request(method: string, url: string, options?: IRequestOptionsWithBody): Observable<any> {
    const path = this.url(url);

    if (this.debugApiCallLogger) {
      this.debugApiCallLogger(method, path, this.constructor, options.body);
    }

    return super.request(method, path, options as any);
  }
}
