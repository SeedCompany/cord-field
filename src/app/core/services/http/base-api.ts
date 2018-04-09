import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { AbstractHttpClient, IRequestOptionsWithBody } from './abstract-http-client';

export abstract class BaseApiService extends AbstractHttpClient {

  protected _baseUrl: string;

  get baseUrl(): string {
    return this._baseUrl;
  }

  debugApiCallLogger: (path: string, source: any, body: any, method: string) => void;

  constructor(httpClient: HttpClient, serviceName: string) {
    super(httpClient);

    if (!environment.services || !environment.services[serviceName]) {
      throw new Error(`environment.services is misconfigured for ProfileApiService, expecting key ${serviceName}`);
    }
    this._baseUrl = environment.services[serviceName];
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
