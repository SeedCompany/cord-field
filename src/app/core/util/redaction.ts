export const REDACTED = '🙈';

export function maybeRedacted<T = string>(value: T | null | undefined): T | null {
  return ((typeof value === 'string' && value === REDACTED) || value === undefined) ? null : value;
}

export function isRedacted(value: string | null): boolean {
  return value === REDACTED;
}

