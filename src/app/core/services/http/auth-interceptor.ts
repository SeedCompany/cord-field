import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ExistingProvider, Injectable } from '@angular/core';
import { from as observableFrom, Observable, of as observableOf, Subject, throwError as observableThrow } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationToken } from '../../models/authentication-token';
import { AuthenticationStorageService } from '../authentication-storage.service';

export const IGNORE_AUTH_ERRORS = 'X-Skip-Auth-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

  private serviceLookup: Array<{ id: string, baseUrl: string }> = [];
  private _authError = new Subject<void>();

  static inject(): ExistingProvider {
    return {provide: HTTP_INTERCEPTORS, useExisting: AuthInterceptor, multi: true};
  }

  constructor(private authStorage: AuthenticationStorageService) {
    this.serviceLookup = Object.entries(environment.services).map(([id, baseUrl]) => ({id, baseUrl}));
  }

  get authError(): Observable<void> {
    return this._authError.asObservable();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const service = this.serviceLookup.find((s) => req.url.startsWith(s.baseUrl));
    const authToken$ = service
      ? observableFrom(this.authStorage.getAuthenticationToken(service.id))
      : observableOf(null);

    return authToken$.pipe(
      map((authToken: AuthenticationToken | null) => {
        let headers = req.headers;

        if (authToken && !headers.has('Authorization')) {
          headers = headers.set('Authorization', `Bearer ${authToken.jwtToken}`);
        }

        if (!headers.has('Content-Type')) {
          headers = headers.set('Content-Type', 'application/json');
        }

        let ignoreAuthErrors = false;
        if (headers.has(IGNORE_AUTH_ERRORS)) {
          ignoreAuthErrors = true;
          headers = headers.delete(IGNORE_AUTH_ERRORS);
        }

        const request = req.headers === headers ? req : req.clone({headers});
        return {request, ignoreAuthErrors};
      }),
      switchMap(({request, ignoreAuthErrors}) => {
        return next.handle(request)
          .pipe(catchError(e => {
            if (e instanceof HttpErrorResponse && e.status === 401 && !ignoreAuthErrors) {
              this._authError.next();
            }
            return observableThrow(e);
          }));
      }),
    );
  }
}
