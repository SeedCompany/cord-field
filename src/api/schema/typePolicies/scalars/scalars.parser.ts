import { DateTime } from 'luxon';
import { CalendarDate } from '~/common';
import { Scalars } from '../../schema.graphql';

export const Parsers: {
  [K in keyof Scalars]?: (val: any) => Scalars[K]['output'];
} = {
  Date: (val) => {
    if (DateTime.isDateTime(val)) {
      warnOfCacheIrregularity();
      return val;
    }
    return CalendarDate.fromISO(val);
  },
  DateTime: (val) => {
    if (DateTime.isDateTime(val)) {
      warnOfCacheIrregularity();
      return val;
    }
    return DateTime.fromISO(val);
  },
};

export const optional =
  <T, R>(parser?: (val: T) => R) =>
  (val: T | null | undefined): R | null =>
    val != null ? parser?.(val) ?? (val as unknown as R) : null;

function warnOfCacheIrregularity() {
  console.warn(
    `Date value in cache was already transformed.
The thought as of this writing is that this should be avoided to maintain a consistent cache state.
This has happened because the value was written back to the cache directly. aka. writeQuery()/writeFragment()
`
  );
}
