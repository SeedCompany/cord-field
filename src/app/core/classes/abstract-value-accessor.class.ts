import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleValueAccessor } from './simple-value-accessor';

export { ValueAccessorProvider } from './simple-value-accessor';

/**
 * Provides value property and externalChanges observable.
 * External changes are written to value property and notify the externalChanges stream.
 * Internal changes should be written to value property, which automatically notifies external.
 */
export abstract class AbstractValueAccessor<T> extends SimpleValueAccessor<T> {
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

  /**
   * Externally update the control with a new value.
   * Should not be called from concrete class.
   * @internal
   */
  writeValue(value: T) {
    this._innerValue = value;
    this._valueChange.next(value);
  }
}
