import { HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';
import { dedupeFragmentsPrinter } from './dedupeFragmentsPrinter';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

export const createHttpLink = () =>
  new HttpLink({
    uri: (op) => `${serverHost}/graphql/${op.operationName}`,
    credentials: 'include',
    fetch,
    print: dedupeFragmentsPrinter,
  });
