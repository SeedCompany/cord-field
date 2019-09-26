import { DateTime } from 'luxon';
import { ifValueFn } from './index';

export const maybeDate = ifValueFn(DateTime.fromISO, null);
