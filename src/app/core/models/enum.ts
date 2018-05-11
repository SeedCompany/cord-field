import { isNumeric } from 'rxjs/util/isNumeric';

export type EnumList<T> = Array<EnumListEntry<T>>;
export interface EnumListEntry<T> {
  value: T;
  ui: string;
}

export interface GoodEnum<T> {
  values(): T[];
  entries(): EnumList<T>;
  forUI(value: T): string | null;
  trackEntryBy(index: number, entry: EnumListEntry<T>): T;
  trackValueBy(index: number, value: T): T;
}

export function buildEnum<T>(object: T, valueToUiMapping: {[key: string]: string}): GoodEnum<T> {
  return {
    values: enumValues(object),
    entries: enumEntries(valueToUiMapping),
    forUI: enumForUI(object),
    trackEntryBy: enumTrackEntryBy(),
    trackValueBy: (index: number, value: T) => value
  };
}

function enumValues<T>(object: T): () => T[] {
  const values = Object.values(object).filter(i => typeof i === 'string');
  return () => values;
}

function enumEntries<T>(mapping: { [key: string]: string }): () => EnumList<T> {
  const entries: EnumList<T> = [];
  for (const [value, ui] of Object.entries(mapping) as any as Array<[T, string]>) {
    const val = isNumeric(value) ? parseInt(value.toString(), 10) as any as T : value;
    entries.push({value: val, ui});
  }

  return () => entries;
}

function enumTrackEntryBy() {
  return (index: number, entry: EnumListEntry<any>) => entry.value;
}

function enumForUI<T>(object: T) {
  return (value: T): string | null => {
    const match = (object as any as GoodEnum<T>).entries().find(val => val.value === value);
    return match ? match.ui : null;
  };
}
