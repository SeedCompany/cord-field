import { DateTime } from 'luxon';
import { ifValueFn } from './if-value';

export const serverDate = (isoStr: string) => DateTime.fromISO(isoStr.substr(0, 10));
export const serverDateTime = DateTime.fromISO;
export const maybeServerDate = ifValueFn(serverDate, null);
export const maybeServerDateTime = ifValueFn(serverDateTime, null);
