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

  logLevel: LogLevel = LogLevel.info;

  constructor(@Optional() private analytics?: Angulartics2) {
    const logLevel = (environment.debug || {} as any).level;
    this.logLevel = (LogLevel as any)[logLevel || 'warn'];

    if (this.logLevel === undefined) {
      const values: string[] = [];
      Object.keys(LogLevel).forEach((key) => values.push(key));
      // tslint:disable-next-line
      console.log(`[error] logging system set to invalid log level (${logLevel}). Valid values are: ` +
        `${values.slice(values.length / 2).join(', ')}. Setting to warn.`);
      this.logLevel = LogLevel.warn;
    }
  }

  debug(msg: string | object, ...parts: any[]) {
    if (this.logLevel > LogLevel.debug) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.log(`[debug] ${msg}`, ...parts);
  }

  debugJson(obj: any, msg?: string, ...parts: any[]) {
    if (this.logLevel > LogLevel.debug) {
      return;
    }

    try {
      const json = JSON.stringify(obj, null, 2);
      const disp = (msg) ? `${msg}:\n${json}` : json;
      // tslint:disable-next-line:no-console
      console.log(`[debug] ${disp}`, ...parts);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(`[debug] %o\n${msg}:\n.debugJson encountered error: ${err}`, obj, ...parts);
    }
  }

  info(msg: string, ...parts: any[]) {
    if (this.logLevel > LogLevel.info) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.log(`[info] ${msg}`, ...parts);
  }

  warn(msg: string, ...parts: any[]) {
    if (this.logLevel > LogLevel.warn) {
      return;
    }
    // tslint:disable-next-line:no-console
    console.log(`[warn] ${msg}`, ...parts);
  }

  error(err: Error | Response, msg?: string, ...parts: any[]) {
    let message: string;

    if (err instanceof Response) {
      if (msg) {
        message = `[error (Response)] ${msg}: code: ${err.status}, ${err.statusText}, url: ${err.url}`;
      } else {
        message = `[error (Response)] code: ${err.status}, ${err.statusText}, url: ${err.url}`;
      }
    } else {
      if (msg) {

        message = `[error] ${msg}: ${err.message || 'no error message'}\n${err.stack || 'no call stack'}`;
      } else {
        message = `[error] ${err.message || 'no error message'} ${err.stack || 'no call stack'}`;
      }
    }

    // tslint:disable-next-line:no-console
    console.log(message, ...parts);
    if (!this.analytics) {
      return;
    }
    this.analytics.exceptionTrack.next({
      description: message,
      fatal: false,
    });
  }
}
