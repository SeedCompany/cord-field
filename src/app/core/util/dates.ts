import { DateTime } from 'luxon';

export function maybeDate(serverDate: string | null | undefined): DateTime | null {
  return serverDate ? DateTime.fromISO(serverDate) : null;
}
