import { Directive, ViewContainerRef } from '@angular/core';
import { ElementData } from '@angular/core/src/view';
import { Observable } from 'rxjs';

export interface TableViewFilters<Filters> {
  filters: Observable<Filters>;

  reset(): void;
}

/**
 * Used to mark a component as a table view filter and get around Angular's DI to reference it.
 */
@Directive({
  selector: '[tableFilter]',
})
export class TableFilterDirective<T> implements TableViewFilters<T> {

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  get component(): TableViewFilters<T> {
    const data = (this.viewContainerRef as any)._data as ElementData;
    return data.componentView.component;
  }

  get filters(): Observable<T> {
    return this.component.filters;
  }

  reset(): void {
    this.component.reset();
  }
}
