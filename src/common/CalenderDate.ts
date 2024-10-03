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
import { DefaultValidity, Invalid, Valid } from 'luxon/src/_util';

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

type CalendarDateMaybeValid = CalendarDate<Valid> | CalendarDate<Invalid>;

/**
 * Calendar Dates have no times or timezones.
 *
 * The main goal of this is to provide an independent Luxon DateTime-like object.
 *
 * Whether we need/want it to be type compatible with DateTime has yet to
 * be determined - currently it is.
 */
export class CalendarDate<IsValid extends boolean = DefaultValidity>
  // @ts-expect-error library doesn't explicitly support extension
  extends DateTime<IsValid>
{
  static isDate(o: any): o is CalendarDate {
    return o instanceof CalendarDate;
  }

  static fromDateTime(dt: DateTime): CalendarDateMaybeValid {
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

  static fromHTTP(text: string, options?: DateTimeOptions) {
    return CalendarDate.fromDateTime(super.fromHTTP(text, options));
  }

  static fromISO(text: string, options?: DateTimeOptions) {
    return CalendarDate.fromDateTime(super.fromISO(text, options));
  }

  static fromJSDate(date: Date, options?: DateTimeJSOptions) {
    return CalendarDate.fromDateTime(super.fromJSDate(date, options));
  }

  static fromMillis(ms: number, options?: DateTimeOptions) {
    return CalendarDate.fromDateTime(super.fromMillis(ms, options));
  }

  static fromObject(obj: DateObjectUnits, opts?: DateTimeJSOptions) {
    return CalendarDate.fromDateTime(super.fromObject(obj, opts));
  }

  static fromRFC2822(text: string, options?: DateTimeOptions) {
    return CalendarDate.fromDateTime(super.fromRFC2822(text, options));
  }

  static fromSeconds(seconds: number, options?: DateTimeOptions) {
    return CalendarDate.fromDateTime(
      super.fromSeconds(seconds, options)
    ) as CalendarDate<Valid>;
  }

  static fromSQL(text: string, options?: DateTimeOptions) {
    return CalendarDate.fromDateTime(super.fromSQL(text, options));
  }

  static fromFormat(text: string, format: string, opts?: DateTimeOptions) {
    return CalendarDate.fromDateTime(super.fromFormat(text, format, opts));
  }

  static invalid(reason: any) {
    return CalendarDate.fromDateTime(
      super.invalid(reason)
    ) as CalendarDate<Invalid>;
  }

  static now() {
    return CalendarDate.local();
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
  ): CalendarDateMaybeValid;
  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    opts?: DateTimeJSOptions
  ): CalendarDateMaybeValid;
  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    opts?: DateTimeJSOptions
  ): CalendarDateMaybeValid;
  static local(
    year: number,
    month: number,
    day: number,
    hour: number,
    opts?: DateTimeJSOptions
  ): CalendarDateMaybeValid;
  static local(
    year: number,
    month: number,
    day: number,
    opts?: DateTimeJSOptions
  ): CalendarDateMaybeValid;
  static local(
    year: number,
    month: number,
    opts?: DateTimeJSOptions
  ): CalendarDateMaybeValid;
  static local(year: number, opts?: DateTimeJSOptions): CalendarDateMaybeValid;
  static local(opts?: DateTimeJSOptions): CalendarDate<Valid>;
  static local(...args: any) {
    const dt = super.local(...args);
    return CalendarDate.fromDateTime(dt);
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
  ): CalendarDateMaybeValid;
  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    options?: LocaleOptions
  ): CalendarDateMaybeValid;
  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    options?: LocaleOptions
  ): CalendarDateMaybeValid;
  static utc(
    year: number,
    month: number,
    day: number,
    hour: number,
    options?: LocaleOptions
  ): CalendarDateMaybeValid;
  static utc(
    year: number,
    month: number,
    day: number,
    options?: LocaleOptions
  ): CalendarDateMaybeValid;
  static utc(
    year: number,
    month: number,
    options?: LocaleOptions
  ): CalendarDateMaybeValid;
  static utc(year: number, options?: LocaleOptions): CalendarDateMaybeValid;
  static utc(options?: LocaleOptions): CalendarDate<Valid>;
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

  endOf(unit: DateTimeUnit): this {
    return CalendarDate.fromDateTime(super.endOf(unit)) as this;
  }

  minus(duration: DurationLike): this {
    return CalendarDate.fromDateTime(super.minus(duration)) as this;
  }

  plus(duration: DurationLike): this {
    return CalendarDate.fromDateTime(super.plus(duration)) as this;
  }

  reconfigure(properties: LocaleOptions): this {
    return CalendarDate.fromDateTime(super.reconfigure(properties)) as this;
  }

  set(values: DateObjectUnits): this {
    return CalendarDate.fromDateTime(super.set(values)) as this;
  }

  setLocale(locale: string): this {
    return CalendarDate.fromDateTime(super.setLocale(locale)) as this;
  }

  setZone(_zone: string | Zone, _options?: ZoneOptions) {
    return this as any; // noop
  }

  startOf(unit: DateTimeUnit): this {
    return CalendarDate.fromDateTime(super.startOf(unit)) as this;
  }

  toLocal() {
    return this; // noop
  }

  toUTC() {
    return this; // noop
  }
}
