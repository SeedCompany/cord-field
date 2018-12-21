import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractValueAccessor, ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { GoodEnum } from '@app/core/models/enum';
import { enableControl, TypedFormControl } from '@app/core/util';
import { first, mapTo, switchMap, takeUntil } from 'rxjs/operators';

export type StatusOptions<T> = Array<[string, T]>;

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
  @Input() findAvailableStatuses: (value: T) => StatusOptions<T>;
  @Input() original: T;

  statusCtrl: TypedFormControl<T> = new FormControl();
  availableStatuses: StatusOptions<T> = [];

  constructor(private zone: NgZone, private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.externalChanges.subscribe(value => {
      this.availableStatuses = value ? this.findAvailableStatuses(value) : [];
      enableControl(this.statusCtrl, this.availableStatuses.length > 0);
    });

    // Wait for select options to be rendered before setting value.
    // Select component uses currently rendered options to "select" the value when setting.
    // If there are no options rendered then changing value does nothing.
    // What a PITA this was to figure out. This is exactly why declarative APIs (React) are better.
    this.externalChanges
      .pipe(
        // on change, wait for stable zone aka rendering complete.
        switchMap((status) => this.zone.onStable.pipe(first(), mapTo(status))),
        takeUntil(this.unsubscribe), // If destroying, don't try to update & detect changes
      )
      .subscribe((status) => {
        // Now that changes have settled, change value, and detect changes to re-render
        this.statusCtrl.reset(status, { emitEvent: false });
        this.changeDetector.detectChanges();
      });

    this.statusCtrl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.value = status;
      });
  }

  forUI(value: T): string {
    return value ? (this.enum.forUI(value) || '') : 'Loading...';
  }

  trackByStatus(index: number, item: [string, T]): T {
    return item[1];
  }
}
