import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GoogleAnalyticsService } from './google-analytics.service';

const endpointRegex = new RegExp(`^[^#]*?://.*?(/.*)$`);

export enum LogLevel {
  debug = 0,
  info,
  warn,
  error
}

@Injectable()
export class LoggerService {

  logLevel: LogLevel = LogLevel.info;

  constructor(private ga?: GoogleAnalyticsService) {
    if (!this.ga) {
      this.ga = {
        error() {
          // noop}
        }
      } as any;
    }

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

  /**
   * Used to debug API calls as the application is running. This can be used anywhere, but it's integrated into
   * `api.service.ts`. To enable logging, set your environment to:
   * {
   *  debug: {
   *    apiCalls: '*'    // this will log ALL api calls
   *  }
   * }
   *
   * To log specific api calls:
   * {
   *  debug: {
   *    apiCalls: ['/echo'],
   *  }
   * }
   *
   * To suppress certain bodies on responses (because they're too noisy):
   * {
   *  debug: {
   *    apiCalls: '*',
   *    noBody: ['/some/really/noisy/path']
   *  }
   * }
   *
   * You can also use `noBody: '*'` to suppress all bodies from being displayed in the response debug log
   *
   * debugApiCall strips the query string, so your apiCalls should only be the actual endpoint. For example,
   * '/echo' if you want to debugApiCalls to '/echo?value=hi&status=277'
   *
   * @param path
   * @param source should be set to the class of the service making the API call. For example, with
   * AuthenticationService, your constructor should be:
   *    constructor(..., private api:ProfileService, ...) {
   *      api.source = this;
   *    }
   *
   * Otherwise, you'll end up with the source being: 'source not set'.
   *
   * @param {string} path url being called
   * @param source the object, class, function (etc), that's making the call
   * @param body the body being sent
   * @param {string} method GET | POST | PUT, etc.
   */
  debugApiCall(method: string, path: string, source: any, body: any) {
    if (this.logLevel > LogLevel.debug) {
      return;
    }
    this.logApiCall(method, path, source, body);
  }

  /**
   * See [[LogService.debugApiCall]]
   * @param {string} method
   * @param {string} path
   * @param source
   * @param body
   */
  infoApiCall(method: string, path: string, source: any, body: any) {
    if (this.logLevel > LogLevel.info) {
      return;
    }
    this.logApiCall(method, path, source, body);
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
    this.ga!.error(message);
  }

  private logApiCall(method: string, path: string, source: any, body: any) {
    const apiCalls = (environment.debug || {} as any).apiCalls;
    const noBody: string | string[] | null = (environment.debug || {} as any).noBody;

    if (!apiCalls) {
      return;
    }

    const matches = (typeof path === 'string') ? endpointRegex.exec(path) : null;
    const rawEndpoint = ((matches || []).length > 1) ? matches![1] : '';
    const endPoint = rawEndpoint.split('?')[0];

    if (apiCalls !== '*' && !(Array.isArray(apiCalls) && apiCalls.indexOf(endPoint) > -1)) {
      return;
    }

    source = (source || {} as any).name
      || ((source || {} as any).constructor || {} as any).name
      || source;

    method = method.toUpperCase();

    let json = '{suppressed by debug config}';

    if (!noBody || (
      (typeof noBody === 'string' && noBody !== '*') &&
      (Array.isArray(noBody) && (noBody as string[]).indexOf(endPoint) === -1)
    )) {
      try {
        json = body ? JSON.stringify(body, null, 2) : body;
      } catch (err) {
        json = `non-json-response: ${body}`;
      }
    }

    // tslint:disable-next-line:no-console
    console.log(`[debug-api-${method}] source: ${source}, ${path}, body: ${json}`);
  }
}
