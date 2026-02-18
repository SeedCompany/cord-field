import { createPersistedQueryLink as createLink } from '@apollo/client/link/persisted-queries';
import { print } from '@apollo/client/utilities';
import { DocumentNode } from 'graphql';
import { dedupeFragmentsPrinter } from './dedupeFragmentsPrinter';

export const createPersistedQueryLink = () => createLink({ generateHash });

const generateHash = (doc: DocumentNode) =>
  sha256(dedupeFragmentsPrinter(doc, print));

/*
 * Adapted from https://github.com/sindresorhus/crypto-hash
 * I couldn't get it to import/bundle with razzle/webpack v4
 */

const sha256Browser = async (data: string) => {
  const buffer = new globalThis.TextEncoder().encode(data);
  const hash = await globalThis.crypto.subtle.digest('SHA-256', buffer);
  return bufferToHex(hash);
};
const bufferToHex = (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  let digest = '';
  // eslint-disable-next-line no-restricted-syntax
  for (let index = 0; index < view.byteLength; index += 4) {
    digest += view.getUint32(index).toString(16).padStart(8, '0');
  }
  return digest;
};

const sha256Node = async (data: string) => {
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
};

const sha256 = typeof window === 'undefined' ? sha256Node : sha256Browser;
