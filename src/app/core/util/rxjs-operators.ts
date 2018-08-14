import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { filterEntries } from './array-object-helpers';

/**
 * An RXJs pipeable operator that filters form values to only ones that are valid.
 */
export const onlyValidValues = <T>(form: FormGroup) => (source: Observable<T>): Observable<Partial<T>> => {
  return source.pipe(map(values => filterEntries<Partial<T>>(values, key => form.get(key as string)!.valid)));
};
