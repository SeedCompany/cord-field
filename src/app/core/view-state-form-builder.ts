import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { ChangeEngine } from '@app/core/change-engine';
import { ArrayItem, mapEntries, Omit, skipEmptyViewState, TypedFormControl } from '@app/core/util';
import { getValue } from '@app/core/util/forms';
import { isEqual } from 'lodash-es';
import { identity, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, skip, startWith, takeUntil } from 'rxjs/operators';

export type FormGroupOptions<Form, T, Field extends keyof T> = {
  [FormKey in Partial<keyof Form>]: FormGroupItemOptions<Form, T, FormKey, Form[FormKey]>
};

export type FormGroupItemOptions<Form, T, FormKey, FormValue> =
  (
    // We want the field value to be based on the `field` value. In order to do this,
    // we say it can be one of the FormControlOptions specific to each key in T
    {
      [TKey in keyof T]: Omit<FormControlOptions<T, TKey, FormValue>, 'unsubscribe'>
    }[keyof T]
  ) | (
    // The above is for when the `field` property is specified. We also want it to be
    // optional if the key matches a property in T.
    FormKey extends keyof T
      ? Omit<FormControlOptions<T, FormKey, FormValue>, 'field' | 'unsubscribe'>
      : never
  );

export type FormControlOptions<T, Field extends keyof T, FormValue = any> =
  {
    field: Field;
    unsubscribe: Observable<any>;
    validators?: ValidatorFn[];
    initialValue?: FormValue;
    formToChange?: (formVal: FormValue) => any;
  } & (
  // modelToForm is required if model value is not the same as form value
  T[Field] extends FormValue
    ? { modelToForm?: (modelVal: T[Field]) => FormValue }
    : { modelToForm: (modelVal: T[Field]) => FormValue }
  );

export interface FormArrayOptions<T, Key extends keyof T, Value extends ArrayItem<T[Key]>> {
  field: Key;
  unsubscribe: Observable<void>;
  createControl: (item: Value | undefined, remove: Observable<any>) => AbstractControl;
}

export class ViewStateFormBuilder<T extends { id: string }> {

  constructor(
    private viewState: AbstractViewState<T>,
    private changeEngine: ChangeEngine<T>,
  ) {
  }

  group<Form>(unsubscribe: Observable<any>, controls: FormGroupOptions<Form, T, keyof T>) {
    // `field` type as `any` isn't terrible as it is validated in interface
    return new FormGroup(mapEntries(controls, (field: any, c: any) => this.control({ field, unsubscribe, ...c })));
  }

  control<Field extends keyof T, ViewValue>({
    field,
    unsubscribe,
    validators = [],
    initialValue,
    // Type safety is verified in FormControlOptions.
    // It is only optional if model value and form value are the same, thus identity function.
    modelToForm = identity as unknown as (val: T[Field]) => ViewValue,
    formToChange = identity,
  }: FormControlOptions<T, Field, ViewValue>): TypedFormControl<T[Field]> {
    const control = new FormControl(initialValue, validators);

    // Currently change engine reverts are leaked here (still result in no changes).
    // Because we use the distinctUntilChanged operator, which needs to stay in sync with current value.
    // The DUC operator allows us to skip all non-changes, like when disabling, enabling, and saving.
    // Reverting is definitely the edge case here, and it is only for the fields being reverted.
    control.valueChanges
      .pipe(
        distinctUntilChanged(), // Initialize operator with initial subject value
        skip(1), // But skip initial subject value since it's not a change

        map(formToChange),
        takeUntil(unsubscribe),
      )
      .subscribe(value => {
        if (control.valid) {
          this.viewState.change({ [field]: value } as any);
        } else {
          this.viewState.revert(field);
        }
      });

    this.viewState.subjectWithPreExistingChanges
      .pipe(
        skipEmptyViewState(),
        map(subject => subject[field]),
        map(modelToForm),
        takeUntil(unsubscribe),
      )
      .subscribe(viewValue => {
        control.reset(viewValue);
      });

    this.viewState.isSubmitting
      .pipe(
        takeUntil(unsubscribe),
      )
      .subscribe(submitting => {
        control[submitting ? 'disable' : 'enable']({ emitEvent: false });
      });

    return control;
  }

  /**
   * Create a form array for the given field. This syncs user input and subject changes to the form array
   * and gives back the control and functions to add & remove items from the array.
   */
  array<Key extends keyof T, Value extends ArrayItem<T[Key]>>({
    field,
    unsubscribe,
    createControl,
  }: FormArrayOptions<T, Key, Value>) {
    const form = new FormArray([]);

    // Subjects called on individual item removal
    const subs: Array<Subject<void>> = [];

    const add = (item?: any): void => {
      const removalSubject = new Subject<void>();
      const removeOrDestroy = merge(unsubscribe, removalSubject);

      const control = createControl(item, removeOrDestroy);

      control.valueChanges
        .pipe(
          // Map to raw value which doesn't attempt to mask real value when disabled
          map(() => getValue(control)),

          // Disable/Enable causes unwanted events that don't actually have a change.
          // Filter these out with a deep equality check.
          startWith(getValue(control)), // Initialize distinctUntilChanged
          distinctUntilChanged(isEqual),
          skip(1), // Ignore startWith value

          takeUntil(removeOrDestroy),
        )
        .subscribe((value) => {
          if (control.valid) {
            this.viewState.change({ [field]: { update: value } } as any);
          } else {
            this.viewState.revert(field, value);
          }
        });

      form.push(control);
      subs.push(removalSubject);
    };

    const remove = (index: number, updateState = true): void => {
      const fg = form.at(index);
      form.removeAt(index);
      if (subs[index]) {
        subs[index].next();
        subs[index].complete();
        subs.splice(index, 1);
      }
      if (updateState) {
        this.viewState.change({ [field]: { remove: fg.value } } as any);
      }
    };

    this.viewState.isSubmitting
      .pipe(
        takeUntil(unsubscribe),
      )
      .subscribe(submitting => {
        form[submitting ? 'disable' : 'enable']({ emitEvent: false });
      });

    this.viewState.subjectWithPreExistingChanges
      .pipe(takeUntil(unsubscribe))
      .subscribe(subject => {
        this.setupArrayItems(form, field, subject[field] as any, add, remove);
      });

    return {
      control: form,
      add,
      remove,
    };
  }

  /**
   * This removes existing controls that don't have a model item anymore and adds new controls for new model items.
   */
  private setupArrayItems(
    form: FormArray,
    field: keyof T,
    value: any[],
    onAdd: (value: any) => void,
    onRemove: (index: number, updateState?: boolean) => void,
  ): void {
    const accessor = this.changeEngine.config[field].accessor;

    const newIds = value.map(accessor);
    const currentIds = [];

    // Remove old items in reverse order because FormArray re-indexes on removal
    // which would screw up both our for-loop and the index to remove.
    for (let i = form.length - 1; i >= 0; i--) {
      const id = accessor(getValue(form.at(i)));
      const idx = newIds.indexOf(id);
      if (idx >= 0) {
        form.at(i).reset(value[idx], { emitEvent: false }); // Update value
        currentIds.push(id);
        continue;
      }
      onRemove(i, false);
    }

    for (const edu of value) {
      if (currentIds.includes(accessor(edu))) {
        continue;
      }
      onAdd(edu);
    }
  }
}
