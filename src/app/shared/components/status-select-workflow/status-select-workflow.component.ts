import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractValueAccessor, ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { GoodEnum } from '@app/core/models/enum';
import { enableControl, TypedFormControl } from '@app/core/util';
import { takeUntil } from 'rxjs/operators';

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

  statusCtrl: TypedFormControl<T> = new FormControl(status);
  availableStatuses: StatusOptions<T> = [];

  ngOnInit(): void {
    this.externalChanges.subscribe(value => {
      this.statusCtrl.reset(value, { emitEvent: false });
      this.availableStatuses = value ? this.findAvailableStatuses(value) : [];
      enableControl(this.statusCtrl, this.availableStatuses.length > 0);
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
