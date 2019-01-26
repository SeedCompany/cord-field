import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { ChangeEngine } from '@app/core/change-engine';
import { ArrayItem, mapEntries, Omit, TypedFormControl } from '@app/core/util';
import { identity, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

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

export interface FormControlOptions<T, Field extends keyof T, FormValue = any> {
  field: Field;
  unsubscribe: Observable<any>;
  validators?: ValidatorFn[];
  initialValue?: FormValue;
  modelToForm?: (modelVal: T[Field]) => FormValue;
  formToModel?: (formVal: FormValue) => T[Field];
}

export interface FormArrayOptions<T, Key extends keyof T, Value extends ArrayItem<T[Key]>> {
  field: Key;
  unsubscribe: Observable<void>;
  createControl: (item: Value | undefined, remove: Observable<any>) => AbstractControl;
}

export class ViewStateFormBuilder<T> {

  constructor(
    private viewState: AbstractViewState<T>,
    private changeEngine: ChangeEngine<T>,
  ) {
  }

  group<Form>(unsubscribe: Observable<any>, controls: FormGroupOptions<Form, T, keyof T>) {
    // `field` type as `any` isn't terrible as it is validated in interface
    return new FormGroup(mapEntries(controls, (field: any, c) => this.control({ field, unsubscribe, ...c })));
  }

  control<Field extends keyof T, ViewValue>({
    field,
    unsubscribe,
    validators = [],
    initialValue = null,
    modelToForm = identity,
    formToModel = identity,
  }: FormControlOptions<T, Field, ViewValue>): TypedFormControl<T[Field]> {
    const control = new FormControl(initialValue, validators);

    control.valueChanges
      .pipe(
        map(formToModel),
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
        map(subject => subject[field]),
        map(modelToForm),
        takeUntil(unsubscribe),
      )
      .subscribe(viewValue => {
        control.reset(viewValue, { emitEvent: false });
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
        .pipe(takeUntil(removeOrDestroy))
        .subscribe(() => {
          if (control.valid) {
            this.viewState.change({ [field]: { update: control.value } } as any);
          } else {
            this.viewState.revert(field, control.value);
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
      const id = accessor(form.at(i).value);
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
