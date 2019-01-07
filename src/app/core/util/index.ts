export * from './array-object-helpers';
export * from './dates';
export * from './firstLettersOfWords';
export * from './forms';
export * from './material-types';
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

/**
 * Booleans, non empty arrays and strings return true.
 */
export function hasValue(value: any /* unknown - once Angular catches up */): boolean {
  if (typeof value === 'boolean') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value);
}
