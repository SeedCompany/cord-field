import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-collapsed-chip-list',
  templateUrl: './collapsed-chip-list.component.html',
  styleUrls: ['./collapsed-chip-list.component.scss']
})
export class CollapsedChipListComponent<T> {

  /** The list to display in chips */
  @Input() list: T[];
  /** The number of items to show before collapsing */
  @Input() show = 1;

  // Not to be confused with chip selection events
  @Output() chipClicked = new EventEmitter<T>();

  /**
   * The function to track the items by.
   * Defaulted to something that should work for mose cases to make it easier to use
   * */
  @Input() trackBy: (item: T) => any = item => {
    if (typeof item === 'object') {
      return ('id' in item) ? (item as any).id : ('value' in item) ? (item as any).value : item;
    }

    return item;
  };

  // tslint:disable-next-line:member-ordering this doesn't come from an input so it's "more private"
  @ContentChild(TemplateRef) displayWith: TemplateRef<any>;

  private trackByFn = (index: number, item: T) => {
    return this.trackBy(item);
  };
}
