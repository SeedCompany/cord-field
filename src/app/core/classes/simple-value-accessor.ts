import { forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';

export function ValueAccessorProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => type),
    multi: true,
  };
}

/**
 * Provides onChange/onTouch properties instead of having to mess with register* methods.
 */
export abstract class SimpleValueAccessor<T> extends SubscriptionComponent implements ControlValueAccessor {
  abstract writeValue(val: T): void;

  protected onChange = (val: T) => {};
  protected onTouched = () => {};

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
