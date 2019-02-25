import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { SimpleValueAccessor, ValueAccessorProvider } from '@app/core/classes/simple-value-accessor';
import { MaybeObservable } from '@app/core/util';
import { UniqueTextFieldComponent } from '@app/shared/components/unique-text-field/unique-text-field.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-display-or-edit-field',
  templateUrl: './display-or-edit-field.component.html',
  styleUrls: ['./display-or-edit-field.component.scss'],
  providers: [ValueAccessorProvider(DisplayOrEditFieldComponent)],
})
export class DisplayOrEditFieldComponent extends SimpleValueAccessor<string> implements OnInit {

  @Input() isTaken: (text: string) => MaybeObservable<boolean>;
  @Input() original = '';
  @Input() placeholder = '';
  @Input() maxLength = 140;
  @Input() pendingMessage = 'Checking availability...';
  @Input() autofocus = false;
  @Input() validators: ValidatorFn[];
  @Input() errorMessages: Record<string, string>;

  text = new FormControl('', [Validators.required]);
  editing = false;
  private preExisting: string;
  private openedWithEnter = false;
  private focused = false;
  private pending = false;

  @ViewChild(UniqueTextFieldComponent) input: UniqueTextFieldComponent;

  ngOnInit() {
    this.text.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(text => {
        if (this.text.valid) {
          this.preExisting = text;
          this.onChange(text);
          if (!this.focused) {
            this.done();
          }
        } else {
          this.editing = true;
          this.onChange(this.preExisting);
        }
      });
  }

  writeValue(text: string): void {
    this.text.reset(text, { emitEvent: false });
  }

  edit(event: MouseEvent) {
    this.editing = true;
    this.openedWithEnter = event.clientX === 0 && event.clientY === 0;
    this.input.focus();
  }

  @HostListener('keyup.esc')
  done() {
    if (this.pending) {
      return;
    }
    this.editing = false;
    if (this.text.invalid) {
      this.text.setValue(this.preExisting);
    }
  }

  @HostListener('keyup.enter')
  onEnter() {
    if (this.openedWithEnter) {
      this.openedWithEnter = false;
      return;
    }
    this.done();
  }

  onFocusChange(focused: boolean) {
    this.focused = focused;
    if (!focused) {
      this.done();
    }
  }

  onPendingChange(pending: boolean) {
    this.pending = pending;
  }
}
