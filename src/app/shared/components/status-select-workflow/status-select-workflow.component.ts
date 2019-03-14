import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractValueAccessor, ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { EnumList, EnumListEntry, GoodEnum } from '@app/core/models/enum';
import { enableControl, MaybeObservable, maybeObservable, TypedFormControl } from '@app/core/util';
import { combineLatest, of } from 'rxjs';
import { filter, first, mapTo, switchMap, takeUntil } from 'rxjs/operators';

export interface StatusOptions<T> {
  transitions: EnumList<T>;
  overrides: EnumList<T>;
}
export const emptyOptions: StatusOptions<any> = {
  transitions: [],
  overrides: [],
};

@Component({
  selector: 'app-status-select-workflow',
  templateUrl: './status-select-workflow.component.html',
  styleUrls: ['./status-select-workflow.component.scss'],
  providers: [
    ValueAccessorProvider(StatusSelectWorkflowComponent),
  ],
})
export class StatusSelectWorkflowComponent<T extends GoodEnum<T>> extends AbstractValueAccessor<T> implements OnInit {

  @Input() placeholder = 'Status';
  @Input() enum: T;
  @Input() findAvailableStatuses: (value: T) => MaybeObservable<StatusOptions<T>>;
  @Input() original: T;

  statusCtrl = new FormControl() as TypedFormControl<T>;
  availableStatuses: StatusOptions<T> = emptyOptions;

  constructor(private zone: NgZone, private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.externalChanges
      .pipe(
        switchMap((status) =>
          combineLatest(
            // Wait for select options to be rendered before setting value.
            // Select component uses currently rendered options to "select" the value when setting.
            // If there are no options rendered then changing value does nothing.
            this.zone.onStable.pipe(first(), mapTo(status)),
            // Also get available status for given status
            status ? maybeObservable(this.findAvailableStatuses(status)).pipe(first()) : of(emptyOptions),
          )),
        takeUntil(this.unsubscribe), // If destroying, don't try to update & detect changes
      )
      .subscribe(([status, availableStatuses]) => {
        // Now that changes have settled, change value, and detect changes to re-render
        const { transitions, overrides } = this.availableStatuses = availableStatuses;
        this.statusCtrl.reset(status, { emitEvent: false });
        enableControl(this.statusCtrl, transitions.length > 0 || overrides.length > 0);
        this.changeDetector.detectChanges();
      });

    this.statusCtrl.valueChanges
      .pipe(
        // Filter out "changes" that aren't actually changing the value.
        // This is caused by writeValue() changing the value.
        filter(value => value !== this.value),
        takeUntil(this.unsubscribe),
      )
      .subscribe(status => {
        this.value = status;
      });
  }

  writeValue(value: T) {
    // Change statusCtrl value before rendering takes place. This prevents statusCtrl from emitting
    // a value change of the previous, now incorrect, value after writeValue() is called.
    // The valueChange is still emitted, but now it is the new, correct value.
    this.statusCtrl.reset(value, { emitEvent: false });

    super.writeValue(value);
  }

  forUI(value: T): string {
    return value ? (this.enum.forUI(value) || '') : 'Loading...';
  }

  trackByStatus(index: number, item: EnumListEntry<T>): T {
    return item.value;
  }
}
