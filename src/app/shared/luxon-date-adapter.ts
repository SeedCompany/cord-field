import { Injectable } from '@angular/core';
import { DateAdapter, MatDateFormats } from '@angular/material';
import { DateTime, Info } from 'luxon';

export const MAT_LUXON_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'L/d/yyyy'
  },

  display: {
    dateInput: 'L/d/yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LLL yyyy'
  }
};

/** Creates an array and fills it with values.
 * Copied from NativeDateAdapter
 */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

/**
 * https://github.com/angular/material2/issues/10427
 */
@Injectable()
export class LuxonDateAdapter extends DateAdapter<DateTime> {

  getYear(date: DateTime): number {
    return date.year;
  }

  getMonth(date: DateTime): number {
    // The Datepicker uses this to index into the 0 indexed getMonthNames array so far as I can tell.
    // Because Luxon uses 1-12 for months we need to subtract one.
    return date.month - 1;
  }

  getDate(date: DateTime): number {
    return date.day;
  }

  getDayOfWeek(date: DateTime): number {
    return date.weekday;
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return Info.months(style);
  }

  getDateNames(): string[] {
    const dtf = new Intl.DateTimeFormat(this.locale, {day: 'numeric'});
    return range(31, i => this.stripDirectionalityCharacters(
      dtf.format(new Date(2017, 0, i + 1))));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return Info.weekdays(style);
  }

  getYearName(date: DateTime): string {
    const dtf = new Intl.DateTimeFormat(this.locale, {year: 'numeric'});
    const valueOfDate = date.valueOf();
    return this.stripDirectionalityCharacters(dtf.format(valueOfDate));
  }

  getFirstDayOfWeek(): number {
    return 0; // Assume Sunday.
  }

  getNumDaysInMonth(date: DateTime): number {
    return date.daysInMonth;
  }

  clone(date: DateTime): DateTime {
    return date; // There is no point in cloning a Luxon DateTime since they are immutable.
  }

  createDate(year: number, month: number, date: number): DateTime {
    month += 1; // Luxon utc uses 1-12 for dates, but datepicker passes in 0-11.
    return DateTime.utc(year, month, date);
  }

  today(): DateTime {
    return DateTime.local();
  }

  format(date: DateTime, displayFormat: any): string {
    return date.toFormat(displayFormat);
  }

  addCalendarYears(date: DateTime, years: number): DateTime {
    return date.plus({years});
  }

  addCalendarMonths(date: DateTime, months: number): DateTime {
    return date.plus({months});
  }

  addCalendarDays(date: DateTime, days: number): DateTime {
    return date.plus({days});
  }

  toIso8601(date: DateTime): string {
    return date.toISO();
  }

  isDateInstance(obj: any): boolean {
    return (obj instanceof DateTime);
  }

  isValid(date: DateTime): boolean {
    return date.isValid;
  }

  invalid(): DateTime {
    return DateTime.invalid('Invalid via luxon-date-adapter.');
  }

  parse(value: any, parseFormat: any): DateTime | null {
    if (value && typeof value === 'string') {
      // First try to parse an ISO date
      const aDateTime = DateTime.fromISO(value);
      if (aDateTime.isValid) {
        return aDateTime;
      }
      // Otherwise try to parse according to specified format (useful for user entered values?).
      return DateTime.fromFormat(value, parseFormat);
    }
    return value;
  }

  /**
   * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
   * other browsers do not. We remove them to make output consistent and because they interfere with
   * date parsing.
   * Copied from NativeDateAdapter.
   * @param str The string to strip direction characters from.
   * @returns The stripped string.
   */
  private stripDirectionalityCharacters(str: string): string {
    return str.replace(/[\u200e\u200f]/g, '');
  }

  deserialize(value: any): DateTime | null {
    let date;
    if (value instanceof Date) {
      date = DateTime.fromJSDate(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = DateTime.fromISO(value);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}
