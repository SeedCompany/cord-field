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
  valueChange: Subject<T> = new Subject<T>();

  private _innerValue: T;

  /**
   * Call to change value and notify form of value change
   */
  set value(value: T) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this.onChange(value);
      this.onTouched();
      this.valueChange.next(value);
    }
  }
  get value(): T {
    return this._innerValue;
  }

  onChange = (_: T) => { };
  onTouched = () => { };

  writeValue(value: T) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this.valueChange.next(value);
    }
  }

  registerOnChange(fn: (_: T) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
