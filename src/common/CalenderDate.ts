import {
  DateObjectUnits,
  DateTime,
  DateTimeJSOptions,
  DateTimeOptions,
  DateTimeUnit,
  DurationLike,
  LocaleOptions,
  ToISOTimeOptions,
  Zone,
  ZoneOptions,
} from 'luxon';

declare module 'luxon/src/datetime' {
  interface DateTime {
    fiscalYear: number;
    fiscalQuarter: number;
  }
}

Object.defineProperties(DateTime.prototype, {
  fiscalYear: {
    get(this: DateTime) {
      return this.month >= 10 ? this.year + 1 : this.year;
    },
  },
  fiscalQuarter: {
    get(this: DateTime) {
      return this.quarter === 4 ? 1 : this.quarter + 1;
    },
  },
});

/**
 * Calendar Dates have no times or timezones.
 *
 * The main goal of this is to provide an independent Luxon DateTime-like object.
 *
 * Whether we need/want it to be type compatible with DateTime has yet to
 * be determined - currently it is.
 */
export class CalendarDate
  // @ts-expect-error library doesn't explicitly support extension
  extends DateTime
{
  static isDate(o: any): o is CalendarDate {
    return o instanceof CalendarDate;
  }

  static fromDateTime(dt: DateTime): CalendarDate {
    if (dt instanceof CalendarDate) {
      return dt;
    }
    const inst = dt.startOf('day') as any;
    // props must be manually enumerated because of our hacky-inspect-dates
    // monkey patch which makes all its props non-enumerable
    return new CalendarDate({
      ts: inst.ts,
      zone: inst.zone,
      c: inst.c,
      o: inst.o,
      loc: inst.loc,
      invalid: inst.invalid,
    });
  }

  protected constructor(args: any = {}) {
    super(args);
  }

  [Symbol.for('inspect')]() {
    return this.toLocaleString(DateTime.DATE_SHORT);
  }

  toISO(_options?: ToISOTimeOptions) {
    return this.toISODate();
  }

  static fromHTTP(text: string, options?: DateTimeOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromHTTP(text, options));
  }

  static fromISO(text: string, options?: DateTimeOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromISO(text, options));
  }

  static fromJSDate(date: Date, options?: DateTimeJSOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromJSDate(date, options));
  }

  static fromMillis(ms: number, options?: DateTimeOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromMillis(ms, options));
  }

  static fromObject(
    obj: DateObjectUnits,
    opts?: DateTimeJSOptions
  ): CalendarDate {
    return CalendarDate.fromDateTime(super.fromObject(obj, opts));
  }

  static fromRFC2822(text: string, options?: DateTimeOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromRFC2822(text, options));
  }

  static fromSeconds(seconds: number, options?: DateTimeOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromSeconds(seconds, options));
  }

  static fromSQL(text: string, options?: DateTimeOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.fromSQL(text, options));
  }

  static fromFormat(
    text: string,
    format: string,
    opts?: DateTimeOptions
  ): CalendarDate {
    return CalendarDate.fromDateTime(super.fromFormat(text, format, opts));
  }

  static invalid(reason: any): CalendarDate {
    return CalendarDate.fromDateTime(super.invalid(reason));
  }

  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
    opts?: DateTimeJSOptions
  ): DateTime;
  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    opts?: DateTimeJSOptions
  ): DateTime;
  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    opts?: DateTimeJSOptions
  ): DateTime;
  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    opts?: DateTimeJSOptions
  ): DateTime;
  static local(
    year: number,
    month: number,
    day: number,
    opts?: DateTimeJSOptions
  ): DateTime;
  static local(year: number, month: number, opts?: DateTimeJSOptions): DateTime;
  static local(year: number, opts?: DateTimeJSOptions): DateTime;
  static local(opts?: DateTimeJSOptions): DateTime;
  static local(...args: any) {
    const dt = super.local(...args);
    return CalendarDate.fromDateTime(dt);
  }

  static max(): undefined;
  static max(...dateTimes: DateTime[]): CalendarDate;
  static max(...dateTimes: DateTime[]): CalendarDate | undefined {
    return CalendarDate.fromDateTime(super.max(...dateTimes));
  }

  static min(): undefined;
  static min(...dateTimes: DateTime[]): CalendarDate;
  static min(...dateTimes: DateTime[]): CalendarDate | undefined {
    return CalendarDate.fromDateTime(super.min(...dateTimes));
  }

  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
    options?: LocaleOptions
  ): DateTime;
  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    options?: LocaleOptions
  ): DateTime;
  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    options?: LocaleOptions
  ): DateTime;
  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    options?: LocaleOptions
  ): DateTime;
  static utc(
    year: number,
    month: number,
    day: number,
    options?: LocaleOptions
  ): DateTime;
  static utc(year: number, month: number, options?: LocaleOptions): DateTime;
  static utc(year: number, options?: LocaleOptions): DateTime;
  static utc(options?: LocaleOptions): DateTime;
  static utc(...args: any) {
    return CalendarDate.fromDateTime(super.utc(...args));
  }

  static fiscalYearEndToCalendarDate = (year: number | null | undefined) =>
    year
      ? CalendarDate.fromObject({
          year,
          month: 9,
          day: 30,
        })
      : undefined;

  endOf(unit: DateTimeUnit): CalendarDate {
    return CalendarDate.fromDateTime(super.endOf(unit));
  }

  minus(duration: DurationLike): CalendarDate {
    return CalendarDate.fromDateTime(super.minus(duration));
  }

  plus(duration: DurationLike): CalendarDate {
    return CalendarDate.fromDateTime(super.plus(duration));
  }

  reconfigure(properties: LocaleOptions): CalendarDate {
    return CalendarDate.fromDateTime(super.reconfigure(properties));
  }

  set(values: DateObjectUnits): CalendarDate {
    return CalendarDate.fromDateTime(super.set(values));
  }

  setLocale(locale: string): CalendarDate {
    return CalendarDate.fromDateTime(super.setLocale(locale));
  }

  setZone(_zone: string | Zone, _options?: ZoneOptions): CalendarDate {
    return this; // noop
  }

  startOf(unit: DateTimeUnit): CalendarDate {
    return CalendarDate.fromDateTime(super.startOf(unit));
  }

  toLocal(): CalendarDate {
    return this; // noop
  }

  toUTC(): CalendarDate {
    return this; // noop
  }
}
