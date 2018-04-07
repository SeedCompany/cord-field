import {
  HttpClient,
  HttpEvent,
  HttpHeaders as HttpHeadersObject,
  HttpParams as HttpParamsObject,
  HttpResponse
} from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { Observable } from 'rxjs/Observable';

type HttpHeaders = HttpHeadersObject | { [header: string]: string | string[] };
type HttpParams = HttpParamsObject | { [param: string]: string | string[] };
export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export interface IRequestOptionsWithBody extends IRequestOptions {
  body?: any;
}

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: HttpObserve;
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: ResponseType;
  withCredentials?: boolean;
}

/**
 * This is the same logic/definitions as HttpClient.
 * The only difference is it is not decorated with @Injectable().
 * This allows it to be extended and used multiple times by concrete services.
 */
export abstract class AbstractHttpClient {

  protected constructor(private httpClient: HttpClient) {
  }

  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    params?: HttpParams,
    observe: 'events',
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  request<R = any>(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    reportProgress?: boolean,
    observe: 'events',
    params?: HttpParams,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<R>>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  request(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  request<R = Object>(method: string, url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<R>>;
  request<R = Object>(method: string, url: string, options?: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<R>;
  request(method: string, url: string, options?: IRequestOptionsWithBody): Observable<any> {
    return this.httpClient.request(method, url, options);
  }

  delete(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  delete<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  delete(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  delete<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  delete<T = Object>(url: string, options?: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  delete(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('DELETE', url, options as any);
  }

  get(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  get<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  get(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  get<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  get<T = Object>(url: string, options?: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  get(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('GET', url, options as any);
  }

  head(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  head<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  head(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  head<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  head<T = Object>(url: string, options?: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  head(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('HEAD', url, options as any);
  }

  options(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  options<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  options(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  options<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  options<T = Object>(url: string, options?: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  options(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('OPTIONS', url, options as any);
  }

  patch(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  patch<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  patch(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  patch<T = Object>(url: string, options: {
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  patch<T = Object>(url: string, options?: {
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  patch(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('PATCH', url, options as any);
  }

  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  post<T = Object>(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  post(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  post<T = Object>(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  post<T = Object>(url: string, options?: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  post(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('POST', url, options as any);
  }

  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<ArrayBuffer>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<Blob>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<string>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpEvent<ArrayBuffer>>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpEvent<Blob>>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpEvent<string>>;
  put<T = Object>(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'events',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpEvent<T>>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'arraybuffer',
    withCredentials?: boolean
  }): Observable<HttpResponse<ArrayBuffer>>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'blob',
    withCredentials?: boolean
  }): Observable<HttpResponse<Blob>>;
  put(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType: 'text',
    withCredentials?: boolean
  }): Observable<HttpResponse<string>>;
  put<T = Object>(url: string, options: {
    body?: any,
    headers?: HttpHeaders,
    observe: 'response',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<HttpResponse<T>>;
  put<T = Object>(url: string, options?: {
    body?: any,
    headers?: HttpHeaders,
    observe?: 'body',
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean
  }): Observable<T>;
  put(url: string, options: IRequestOptions = {}): Observable<any> {
    return this.request<any>('PUT', url, options as any);
  }
}
