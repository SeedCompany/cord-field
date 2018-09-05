import { forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

export function ValueAccessorProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => type),
    multi: true
  };
}

export abstract class AbstractValueAccessor<T> implements ControlValueAccessor {
  valueChange: Subject<T | T[]> = new Subject<T | T[]>();

  private _innerValue: T | T[];

  set value(value: T | T[]) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this.onChange(value);
      this.valueChange.next(value);
    }
  }
  get value(): T | T[] {
    return this._innerValue;
  }

  onChange = (_: T | T[]) => { };
  onTouched = () => { };

  writeValue(value: T | T[]) {
    this.value = value;
  }

  registerOnChange(fn: (_: T | T[]) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
