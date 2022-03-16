import { Location } from 'history';
import { splice } from './array-helpers';

export const splicePath = (
  path: string | Location,
  ...args: Parameters<string[]['splice']>
) => {
  path = typeof path === 'string' ? path : path.pathname;
  return splice(path.split('/'), ...args).join('/');
};

export const trailingSlash = (url?: string) =>
  url?.endsWith('/') ? url : (url ?? '') + '/';

export const withoutTrailingSlash = (url: string) =>
  url.endsWith('/') ? url.slice(0, -1) : url;
