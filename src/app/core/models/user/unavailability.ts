import { generateObjectId, Omit } from '@app/core/util';
import { DateTime, Interval } from 'luxon';

export class Unavailability {
  readonly id: string;
  description: string;
  range: Interval;

  get start() {
    return this.range.start;
  }

  get end() {
    return this.range.end;
  }

  static fromJson(json: Partial<Record<keyof Unavailability, any>>): Unavailability {
    const obj = new Unavailability();

    // @ts-ignore readonly property
    obj.id = json.id;
    obj.description = json.description || '';
    obj.range = json.start && json.end
      ? Interval.fromDateTimes(DateTime.fromISO(json.start), DateTime.fromISO(json.end))
      : Interval.invalid('Missing start or end');

    return obj;
  }

  static create(): Unavailability {
    return Object.assign(new Unavailability(), {
      id: generateObjectId(),
      description: '',
      range: Interval.invalid('Not set'),
    });
  }

  static fromForm({ id, description, start, end }: RawUnavailability) {
    return Object.assign(new Unavailability(), {
      id,
      description,
      range: Interval.fromDateTimes(start, end),
    });
  }

  static forSaveAPI({ id, description, start, end }: Unavailability): RawUnavailability {
    return {
      id,
      description,
      start,
      end,
    };
  }

  static store(un: Unavailability): StoredUnavailability {
    return {
      ...un,
      range: un.range.toISO(),
    };
  }
  static restore(stored: StoredUnavailability): Unavailability {
    return Object.assign(new Unavailability(), {
      ...stored,
      range: Interval.fromISO(stored.range),
    });
  }
}

export type RawUnavailability = Omit<Unavailability, 'range'>;
type StoredUnavailability = Omit<RawUnavailability, 'start' | 'end'> & {range: string};
