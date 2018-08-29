import { Component, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { LanguageListFilter } from '@app/core/models/language';
import { Location } from '@app/core/models/location';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-language-list-filter',
  templateUrl: './language-list-filter.component.html',
  styleUrls: ['./language-list-filter.component.scss']
})
export class LanguageListFilterComponent implements OnInit {

  form = this.formBuilder.group({
    location: [[]]
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  get locations(): AbstractControl {
    return this.form.get('location')!;
  }

  @Output() get filters(): Observable<LanguageListFilter> {
    return this.form.valueChanges
      .pipe(map(filters => {
        const result: any = {};
        for (const [key, value] of Object.entries(filters)) {
          if (!value) {
            continue;
          }
          if (Array.isArray(value)) {
            if (value.length === 0) {
              continue;
            }
          }

          result[key] = value;
        }

        return result;
      }));
  }

  onLocationSelected(location: Location): void {
    this.locations.setValue([...this.locations.value, location]);
  }

  onLocationRemoved(location: Location): void {
    this.locations.setValue((this.locations.value as Location[]).filter(loc => loc.id !== location.id));
  }

  reset() {
    this.form.reset({
      location: []
    });
  }
}
