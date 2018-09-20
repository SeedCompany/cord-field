// Stricter versions of material classes/interfaces
import { MatSort, Sort } from '@angular/material';
import { Omit } from '@app/core/util/types';
import { Observable } from 'rxjs';

export interface TypedMatSort<Keys extends string> extends Omit<MatSort, 'sortChange'> {
  active: Keys;
  sortChange: Observable<TypedSort<Keys>>;
}

export interface TypedSort<Keys extends string> extends Sort {
  active: Keys;
}
