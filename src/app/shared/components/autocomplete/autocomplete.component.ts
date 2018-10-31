import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
import { AbstractValueAccessor, ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { from as observableFrom } from 'rxjs';
import { catchError, debounceTime, filter, switchMap, tap } from 'rxjs/operators';

/**
 * This component tries to abstract the similar logic of a few different use cases:
 * - Autocomplete a value for a required field
 * - Autocomplete a value to add to an externally managed list
 * - Autocomplete a value to add to an externally managed list and display the list as chips
 */
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    ValueAccessorProvider(AutocompleteComponent)
  ]
})
export class AutocompleteComponent<T> extends AbstractValueAccessor<T> implements AfterViewInit, OnChanges, OnInit {

  /** The current list state so those items can be filtered out from results */
  @Input() list: T[] = [];

  @Input() displayItem: (item: T) => string;
  @Input() fetcher: (term: string) => Promise<T[]>;
  @Input() trackBy: (item: T) => any;

  /** Display list input as chip list */
  @Input() chips = false;
  @Input() dedupe = false;
  @Input() dedupeOptions: T[] = [];
  @Input() autoFocus = false;
  @Input() clearButton = false;
  @Input() keepInput = false;
  @Input() required = false;
  @Input() placeholder = 'Search';
  @Input() requiredMessage = 'Please enter a value';
  @Input() serverErrorMessage = 'Failed to fetch results';
  @Input() pendingMessage = 'Searching...';
  @Input() noMatchesMessage = 'No matches found';

  @Output() optionSelected = new EventEmitter<T | null>();
  @Output() cancel = new EventEmitter<void>();
  @Output() removed = new EventEmitter<T>();

  searchCtrl: AbstractControl = new FormControl();
  filteredOptions: T[] = [];
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;
  private validSelection: boolean;
  private sendClear: boolean;

  constructor(private snackBar: MatSnackBar) {
    super();

    this.trackBy = ((item: { id: string }) => item.id) as any;
  }

  ngOnInit(): void {
    this.valueChange.subscribe((value) => {
      this.searchCtrl.setValue(value);
    });
  }

  get panelOpen() {
    return this.autocomplete.panelOpen;
  }

  focus() {
    this.searchInput.nativeElement.focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.autoFocus && changes.autoFocus.currentValue) {
      window.setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 0);
    }
    if (changes.required) {
      this.searchCtrl.setValidators(changes.required.currentValue ? Validators.required : null);
    }
  }

  ngAfterViewInit(): void {
    this.searchCtrl
      .valueChanges
      .pipe(
        filter((term) => typeof term === 'string'),
        debounceTime(300),
        tap(() => {
          this.filteredOptions.length = 0;
          this.searchCtrl.markAsPending();

          if (this.keepInput && this.validSelection) {
            this.validSelection = false;
            this.sendClear = true;
          }
        }),
        switchMap((term) => {
          return observableFrom(this.fetcher(term))
            // returning error to prevent observable from completing
            .pipe(catchError<T[], HttpErrorResponse>((err) => err));
        })
      )
      .subscribe((payload: T[] | HttpErrorResponse) => {

        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
        }

        if (payload instanceof HttpErrorResponse) {
          this.snackBarRef = this.snackBar.open(this.serverErrorMessage, undefined, {
            duration: 3000
          });

          return;
        }

        if (this.searchCtrl.hasError('required')) {
          return;
        }

        // Be sure first error shows immediately instead of waiting for field to blur
        this.searchCtrl.markAsTouched();

        // Remove currently selected values
        if (this.chips) {
          payload = payload.filter((item) => !(this.value as T[]).map(this.trackBy).includes(this.trackBy(item)));
        }

        // Remove dedupe options
        if (this.dedupeOptions.length) {
          const dedupeItems = this.dedupeOptions.map(this.trackBy);
          payload = payload.filter((item) => !dedupeItems.includes(this.trackBy(item)));
        }

        this.filteredOptions = payload;

        this.searchCtrl.setErrors(this.filteredOptions.length === 0 ? { noMatches: true } : null);
      });

    this.autocomplete.panelClosingActions.subscribe(() => {
      if (!this.keepInput || !this.validSelection) {
        this.onCancel();
      }
    });
  }

  /** autocomplete sometimes gives null so handle that internally to make it easier on `displayItem` input. */
  displayWith = (object: T | null): string => {
    return object ? this.displayItem(object) : '';
  };

  trackByFn = (index: number, object: T) => {
    return this.trackBy(object);
  };

  onSelect(event: MatAutocompleteSelectedEvent): void {
    const value: T = event.option.value;

    this.optionSelected.next(value);

    if (this.chips) {
      this.writeValue([...this.value as T[] || [], value]);
    } else {
      this.writeValue(value);
    }

    if (this.keepInput) {
      this.validSelection = true;
      this.sendClear = false;
    }

    this.onCancel(!this.keepInput);
  }

  onCancel(clear = true, close = true): void {

    if (clear) {
      this.searchCtrl.setValue(null);

      if (this.chips && this.searchInput) {
        this.searchInput.nativeElement.value = null;
      }
    }

    this.filteredOptions.length = 0;

    if (this.keepInput && this.sendClear) {
      this.sendClear = false;
      this.optionSelected.next(null);
    }

    if (close) {
      this.cancel.next();
    }
  }

  clearThenClose() {

    if (this.searchCtrl.value) {
      this.onCancel(true, false);
    } else {
      this.onCancel();
    }
  }

  isEmpty(): boolean {
    if (this.value instanceof Array) {
      return !this.value.length;
    } else {
      return !this.value;
    }
  }
}
