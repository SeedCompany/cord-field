import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { AuthenticationToken } from '../../models/authentication-token';
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
    options = options || {}  as IRequestOptionsWithBody;

    if (this.debugApiCallLogger) {
      this.debugApiCallLogger(method, path, this.constructor, options ? options.body : null);
    }

    return Observable
      .of(this.authStorage.getAuthenticationToken(this.serviceName))
      .do((authToken) => {

        // set 'Authorization' and 'Content-Type' headers to their defaults if not provided.
        const headers: any = {...options!.headers};
        if (authToken) {
          headers['Authorization'] = headers['Authorization'] || `Bearer ${(authToken as any).jwtToken}`;
        }

        headers['Content-Type'] = headers['Content-Type'] || 'application/json';

        // any header set to 'undefined'  cause a "Cannot read property 'length' of undefined" error, which is hard
        // to debug, so spend a few cycles making sure that none of the keys have a value of undefined.
        const keys = Object.keys(headers);
        for (const key of keys) {
          if (headers[key] === undefined || headers[key] === null) {
            delete headers[key];
          }
        }

        options!.headers = new HttpHeaders(headers);
      })
      .switchMap(() => super.request(method, path, options as any));

  }
}
