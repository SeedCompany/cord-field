import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LoggerService } from '@app/core/services/logger.service';
import { EMPTY, Observable, throwError as observableThrow } from 'rxjs';
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
    private snackBar: MatSnackBar,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError(e => {
        if (e instanceof HttpErrorResponse) {
          if (e.status === 500 && e.error.trace) {
            this.logger.error(JSON.parse(e.error.trace).stack);
          } else if (e.status === 0) {
            this.snackBar.open('Unable to communicate with server', undefined, { duration: 3000 });
            return EMPTY;
          }
        }

        return observableThrow(e);
      }));
  }
}
