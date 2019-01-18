import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, throwError as observableThrow } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  static inject(): Provider {
    return {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true};
  }

  constructor(
    private logger: LoggerService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError(e => {
        if (e instanceof HttpErrorResponse && e.status === 500 && e.error.trace) {
          this.logger.error(JSON.parse(e.error.trace).stack);
        }

        return observableThrow(e);
      }));
  }
}
