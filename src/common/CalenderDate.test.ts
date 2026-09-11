import {
  CalendarDate,
  isDateAfter,
  isDateBefore,
  ISOString,
} from './CalenderDate';

const iso = (date: string) => date as ISOString;

describe('isDateBefore / isDateAfter', () => {
  it('orders two dates', () => {
    const earlier = iso('2024-01-01');
    const later = iso('2024-06-30');

    expect(isDateBefore(earlier, later)).toBe(true);
    expect(isDateAfter(earlier, later)).toBe(false);

    expect(isDateAfter(later, earlier)).toBe(true);
    expect(isDateBefore(later, earlier)).toBe(false);
  });

  // The complete date is allowed to land exactly on the project's end date, and
  // a ceremony exactly on its start. Both rules are expressed as "not after" /
  // "not before", so an equal pair has to answer false either way.
  it('treats an equal pair as neither before nor after', () => {
    const date = iso('2024-06-30');

    expect(isDateBefore(date, iso('2024-06-30'))).toBe(false);
    expect(isDateAfter(date, iso('2024-06-30'))).toBe(false);
  });

  // Callers rely on this to compare values the user has not filled in yet, which
  // is why the validate functions carry no null checks of their own.
  it.each([
    ['a missing left side', null, iso('2024-01-01')],
    ['a missing right side', iso('2024-01-01'), null],
    ['an undefined left side', undefined, iso('2024-01-01')],
    ['an undefined right side', iso('2024-01-01'), undefined],
    ['both missing', null, undefined],
  ])('returns false for %s', (_label, date, other) => {
    expect(isDateBefore(date, other)).toBe(false);
    expect(isDateAfter(date, other)).toBe(false);
  });

  // One side is typically an ISO string off a GraphQL fragment while the other
  // is a CalendarDate held in form state.
  it('compares ISO strings and CalendarDates interchangeably', () => {
    const earlier = CalendarDate.fromISO('2024-01-01');
    const later = CalendarDate.fromISO('2024-06-30');

    expect(isDateBefore(earlier, later)).toBe(true);
    expect(isDateBefore(earlier, iso('2024-06-30'))).toBe(true);
    expect(isDateBefore(iso('2024-01-01'), later)).toBe(true);

    expect(isDateAfter(later, iso('2024-01-01'))).toBe(true);
    expect(isDateAfter(iso('2024-06-30'), earlier)).toBe(true);

    expect(isDateBefore(earlier, CalendarDate.fromISO('2024-01-01'))).toBe(
      false
    );
    expect(isDateAfter(iso('2024-01-01'), earlier)).toBe(false);
  });
});
