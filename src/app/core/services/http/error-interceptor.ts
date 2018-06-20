import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  static inject(): Provider {
    return {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true};
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .catch(e => {
        if (e instanceof HttpErrorResponse && e.status === 500 && e.error.error === 'SERVER_ERROR') {
          // tslint:disable-next-line:no-console
          console.error(JSON.parse(e.error.trace).stack);
        }

        return Observable.throw(e);
      });
  }
}
