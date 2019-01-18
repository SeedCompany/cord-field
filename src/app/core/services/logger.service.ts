import { Injectable, Optional } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  debug = 0,
  info,
  warn,
  error,
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {

  logLevel = LogLevel.info;

  constructor(@Optional() private analytics?: Angulartics2) {
    const logLevel = (environment.debug || {} as any).level;
    this.logLevel = logLevel in LogLevel ? (LogLevel as any)[logLevel] as LogLevel : LogLevel.warn;
  }

  debug(msg: string | object, ...parts: any[]) {
    if (this.logLevel > LogLevel.debug) {
      return;
    }

    // tslint:disable-next-line:no-console
    (console.debug || console.info)(msg, ...parts);
  }

  info(msg: string, ...parts: any[]) {
    if (this.logLevel > LogLevel.info) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.info(msg, ...parts);
  }

  warn(msg: string, ...parts: any[]) {
    if (this.logLevel > LogLevel.warn) {
      return;
    }
    // tslint:disable-next-line:no-console
    console.warn(msg, ...parts);
  }

  error(err: Error | string, ...parts: any[]) {
    // tslint:disable-next-line:no-console
    console.error(err, ...parts);

    if (!this.analytics) {
      return;
    }
    const description = err instanceof Error ? (err.message + (err.stack ? `\n${err.stack}` : '')) : err;
    this.analytics.exceptionTrack.next({
      description,
      fatal: false,
    });
  }
}
