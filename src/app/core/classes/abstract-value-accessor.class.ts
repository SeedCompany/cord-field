import { forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function ValueAccessorProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => type),
    multi: true,
  };
}

export abstract class AbstractValueAccessor<T> extends SubscriptionComponent implements ControlValueAccessor {
  private _valueChange: Subject<T> = new Subject<T>();
  /**
   * An observable of external value changes.
   * Use this to update internal representation of new value.
   */
  readonly externalChanges = this._valueChange.asObservable().pipe(takeUntil(this.unsubscribe));
  private _innerValue: T;

  /**
   * Call to change value and notify form of value change
   */
  set value(value: T) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this.onChange(value);
      this.onTouched();
    }
  }
  get value(): T {
    return this._innerValue;
  }

  /**
   * Call `value` setter instead.
   * @internal
   */
  onChange = (_: T) => { };
  onTouched = () => { };

  /**
   * Externally update the control with a new value.
   * Should not be called from concrete class.
   * @internal
   */
  writeValue(value: T) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this._valueChange.next(value);
    }
  }

  /**
   * Should not be called from concrete class.
   * @internal
   */
  registerOnChange(fn: (_: T) => {}): void {
    this.onChange = fn;
  }

  /**
   * Should not be called from concrete class.
   * @internal
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
