import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthenticationStorageService } from '../authentication-storage.service';
import { AbstractHttpClient, IRequestOptionsWithBody } from './abstract-http-client';

export abstract class BaseApiService extends AbstractHttpClient {

  protected _baseUrl: string;

  get baseUrl(): string {
    return this._baseUrl;
  }

  debugApiCallLogger: (path: string, source: any, body: any, method: string) => void;

  constructor(private authStorage: AuthenticationStorageService,
              private serviceName: string,
              httpClient: HttpClient) {
    super(httpClient);

    if (!environment.services || !(environment.services as any)[this.serviceName]) {
      throw new Error(`environment.services is misconfigured for ${this.constructor.name}, expecting key ${this.serviceName}`);
    }
    this._baseUrl = (environment.services as any)[this.serviceName];
  }

  url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  request(method: string, url: string, options?: IRequestOptionsWithBody): Observable<any> {
    const path = this.url(url);

    if (this.debugApiCallLogger) {
      this.debugApiCallLogger(method, path, this.constructor, options ? options.body : null);
    }

    return super.request(method, path, options as any);
  }
}
