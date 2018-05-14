import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { ExistingProvider, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { AuthenticationStorageService } from '../authentication-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private serviceLookup: Array<{ id: string, baseUrl: string }> = [];

  static inject(): ExistingProvider {
    return {provide: HTTP_INTERCEPTORS, useExisting: AuthInterceptor, multi: true};
  }

  constructor(private authStorage: AuthenticationStorageService) {
    this.serviceLookup = Object.entries(environment.services).map(([id, baseUrl]) => ({id, baseUrl}));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const service = this.serviceLookup.find((s) => req.url.startsWith(s.baseUrl));

    if (!service) {
      return next.handle(req);
    }

    return Observable
      .fromPromise(this.authStorage.getAuthenticationToken(service.id))
      .map((authToken) => {

        const headers: any = {...(req.headers || {})};

        if (authToken) {
          headers.Authorization = headers.Authorization || `Bearer ${(authToken as any).jwtToken}`;
        }
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';

        // any header set to 'undefined'  cause a "Cannot read property 'length' of undefined" error, which is hard
        // to debug, so spend a few cycles making sure that none of the keys have a value of undefined.
        for (const key of Object.keys(headers)) {
          if (headers[key] == null) {
            delete headers[key];
          }
        }

        return req.clone({
          headers: new HttpHeaders(headers)
        });
      })
      .switchMap((newReq) => next.handle(newReq));
  }
}
