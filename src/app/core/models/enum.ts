export type EnumList<T> = Array<EnumListEntry<T>>;
export interface EnumListEntry<T> {
  value: T;
  ui: string;
}

export interface GoodEnum<T> {
  values(): T[];
  entries(): EnumList<T>;
  forUI(value: any): string | null;
  trackEntryBy(index: number, entry: EnumListEntry<T>): T;
  trackValueBy(index: number, value: T): T;
}

export function buildEnum<T>(object: Object, valueToUiMapping: {[key: string]: string}): GoodEnum<T> {
  return {
    values: enumValues(object),
    entries: enumEntries(valueToUiMapping),
    forUI: enumForUI(object),
    trackEntryBy: enumTrackEntryBy(),
    trackValueBy: (index: number, value: T) => value,
  };
}

function enumValues<T>(object: Object): () => T[] {
  const values = Object.values(object).filter(i => typeof i === 'string');
  return () => values;
}

function enumEntries<T>(mapping: { [key: string]: string }): () => EnumList<T> {
  const entries: EnumList<T> = [];
  for (const [valueAsStr, ui] of Object.entries(mapping)) {
    // Object.entries() converts all keys (identified as value here) to strings even if they were numbers before
    // Check if the value is numeric and convert it back to a number so it matches identity checks.
    const value = (isNumeric(valueAsStr) ? parseNumber(valueAsStr) : valueAsStr) as any as T;
    entries.push({ value, ui });
  }

  return () => entries;
}

function enumTrackEntryBy() {
  return (index: number, entry: EnumListEntry<any>) => entry.value;
}

function enumForUI<T>(object: Object) {
  return (value: T): string | null => {
    const match = (object as any as GoodEnum<T>).entries().find(val => val.value === value);
    return match ? match.ui : null;
  };
}

const isNumeric = (value: string) => !isNaN(parseFloat(value)) && isFinite(value as any);
const parseNumber = (value: string) => value.includes('.') ? parseFloat(value) : parseInt(value, 10);
