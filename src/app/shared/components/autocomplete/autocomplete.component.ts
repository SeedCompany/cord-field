import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
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
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent<T> implements AfterViewInit, OnChanges {

  /** The current list state so those items can be filtered out from results */
  @Input() list: T[] = [];

  @Input() set value(value: T | null) {
    this.search.setValue(value);
    this.validSelection = value != null;
  }

  @Input() displayItem: (item: T) => string;
  @Input() fetcher: (term: string) => Promise<T[]>;
  @Input() trackBy: (item: T) => any;

  /** Display list input as chip list */
  @Input() chips = false;
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

  search: AbstractControl = new FormControl();
  searchResults: T[] = [];
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;
  private validSelection: boolean;
  private sendClear: boolean;

  constructor(private snackBar: MatSnackBar) {
    this.trackBy = ((item: { id: string }) => item.id) as any;
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
      this.search.setValidators(changes.required.currentValue ? Validators.required : null);
    }
  }

  ngAfterViewInit(): void {
    this.search
      .valueChanges
      .pipe(
        filter(val => typeof val === 'string'),
        filter(term => term.length > 1),
        debounceTime(300),
        tap(() => {
          this.searchResults.length = 0;
          this.search.markAsPending();
          if (this.keepInput && this.validSelection) {
            this.validSelection = false;
            this.sendClear = true;
          }
        }),
        switchMap(term => {
          return observableFrom(this.fetcher(term))
          // returning error to prevent observable from completing
            .pipe(catchError<T[], HttpErrorResponse>(err => err));
        })
      )
      .subscribe((items: T[] | HttpErrorResponse) => {
        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
        }
        if (items instanceof HttpErrorResponse) {
          this.snackBarRef = this.snackBar.open(this.serverErrorMessage, undefined, {
            duration: 3000
          });
          return;
        }
        if (this.search.hasError('required')) {
          return;
        }

        // Be sure first error shows immediately instead of waiting for field to blur
        this.search.markAsTouched();

        const currentIds = this.list.map(this.trackBy);
        const filtered = items.filter(item => !currentIds.includes(this.trackBy(item)));

        this.searchResults = filtered;
        this.search.setErrors(filtered.length === 0 ? {noMatches: true} : null);
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
    if (this.keepInput) {
      this.validSelection = true;
      this.sendClear = false;
    }

    this.onCancel(!this.keepInput);
  }

  onCancel(clear = true, close = true): void {
    if (clear) {
      this.search.setValue(null);
      if (this.chips && this.searchInput) {
        this.searchInput.nativeElement.value = null;
      }
    }
    this.searchResults.length = 0;

    if (this.keepInput && this.sendClear) {
      this.sendClear = false;
      this.optionSelected.next(null);
    }

    if (close) {
      this.cancel.next();
    }
  }

  clearThenClose() {
    if (this.search.value) {
      this.onCancel(true, false);
    } else {
      this.onCancel();
    }
  }
}
