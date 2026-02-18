import { DateTime } from 'luxon';

const inspect = Symbol.for('inspect');

(DateTime.prototype as any)[inspect] = function (this: DateTime) {
  return (
    this.toLocaleString(DateTime.DATE_SHORT) +
    ', ' +
    this.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)
  );
};

// isLuxonDateTime is the last thing done on DateTime construction
// We'll hook into that here to make all properties getters/setters
// so they don't show up by default in dev console.
// Then we add a `$` property with the formatted human readable value
// This is soo hacky and I wish there was a better way.
Object.defineProperty(DateTime.prototype, 'isLuxonDateTime', {
  get() {
    return true;
  },
  set() {
    makeAllPropsLazy(this).$ = this[inspect]?.();
  },
});

function makeAllPropsLazy(obj: any) {
  const props = splitProps(obj);
  for (const key of Object.keys(props)) {
    Object.defineProperty(obj, key, {
      get(): any {
        return props[key];
      },
      set(v: any) {
        props[key] = v;
      },
      // somehow properties are getting lost if they cannot be enumerated
      enumerable: true,
    });
  }
  return obj;
}

function splitProps(input: any) {
  const props: any = {};
  for (const key of Object.keys(input)) {
    props[key] = input[key];
    // We have to modify input object for this
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete input[key];
  }
  return props;
}
