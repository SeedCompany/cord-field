import { Component, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LanguageListFilter } from '@app/core/models/language';
import { Location } from '@app/core/models/location';
import { filterEntries, hasValue, TypedFormControl } from '@app/core/util';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-language-list-filter',
  templateUrl: './language-list-filter.component.html',
  styleUrls: ['./language-list-filter.component.scss'],
})
export class LanguageListFilterComponent {

  form = this.formBuilder.group({
    location: [[]],
  });

  constructor(private formBuilder: FormBuilder) {
  }

  get locations(): TypedFormControl<Location[]> {
    return this.form.get('location') as TypedFormControl<Location[]>;
  }

  @Output() get filters(): Observable<LanguageListFilter> {
    return this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        map(filters =>
          filterEntries(filters, (key, value) => hasValue(value)),
        ),
      );
  }

  onLocationSelected(location: Location): void {
    this.locations.setValue([...this.locations.value, location]);
  }

  onLocationRemoved(location: Location): void {
    this.locations.setValue(this.locations.value.filter(loc => loc.id !== location.id));
  }

  reset() {
    this.form.reset({
      location: [],
    });
  }
}
