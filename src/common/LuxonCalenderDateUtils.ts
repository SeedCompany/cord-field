import LuxonUtils from '@date-io/luxon';
import { CalendarDate } from './CalenderDate';

/**
 * Until we need to allow users to pick actual DateTimes it's easier to
 * make all date picker values CalendarDate.
 */
export class LuxonCalenderDateUtils extends LuxonUtils {
  private readonly inner: LuxonUtils;
  constructor(...args: any) {
    super(...args);
    // Doing this because calling super doesn't work
    this.inner = new LuxonUtils(...args);
  }

  date = (value?: any) => {
    const d = this.inner.date(value);
    return d ? CalendarDate.fromDateTime(d) : null;
  };

  parseISO = (iso: string) => {
    return CalendarDate.fromISO(iso);
  };

  parse = (value: string, format: string) => {
    const d = this.inner.parse(value, format);
    return d ? CalendarDate.fromDateTime(d) : null;
  };

  formatByString = (date: CalendarDate, format: string) => {
    const d = date.setLocale(this.locale);
    // Hackily get two digit formats for day and month while still respecting
    // the current locale's ordering and separators.
    // Date Picker uses this for input masking.
    return format === 'D'
      ? d.toLocaleString({ year: 'numeric', month: '2-digit', day: '2-digit' })
      : d.toFormat(format);
  };

  /**
   * Hackily determine format helper text since Luxon doesn't support it OOTB.
   * Assumes all numbers are present in text.
   */
  getFormatHelperText = (format: string) => {
    // Derive format based on locale
    // force two digit days & months since masked input
    // doesn't like variable number of digits
    const date = CalendarDate.fromObject(
      {
        year: 1234,
        month: 11,
        day: 29,
      },
      {
        zone: 'utc',
      }
    );
    const text = date
      .toFormat(format, { locale: this.locale })
      .replace('1234', 'yyyy')
      .replace('11', 'mm')
      .replace('29', 'dd');
    return text;
  };
}
