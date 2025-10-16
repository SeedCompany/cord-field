import { HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';
import { dedupeFragmentsPrinter } from './dedupeFragmentsPrinter';
import { SseLink } from './sse.link';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

export const createHttpLink = () =>
  new HttpLink({
    uri: (op) => `${serverHost}/graphql/${op.operationName}`,
    credentials: 'include',
    fetch,
    print: dedupeFragmentsPrinter,
  });

export const createSseLink = () =>
  new SseLink({
    uri: (op) => `${serverHost}/graphql/${op.operationName}`,
    withCredentials: true,
    print: dedupeFragmentsPrinter,
  });
