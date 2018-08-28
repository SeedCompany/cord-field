export * from './array-object-helpers';
export * from './firstLettersOfWords';
export * from './forms';
export * from './redaction';
export * from './rxjs-operators';
export * from './types';

export function generateObjectId(): string {
  // tslint:disable:no-bitwise
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'
    .replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16))
    .toLowerCase();
  // tslint:enable:no-bitwise
}
