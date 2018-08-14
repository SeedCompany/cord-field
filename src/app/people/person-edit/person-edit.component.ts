import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { TitleAware } from '../../core/decorators';
import { popInOut } from '../../shared/animations';
import { UserViewStateService } from '../user-view-state.service';
import { AbstractPersonComponent } from './abstract-person.component';

interface TabConfig {
  path: string;
  label: string;
}

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss'],
  animations: [popInOut]
})
@TitleAware()
export class PersonEditComponent extends AbstractPersonComponent implements OnInit {

  readonly tabs: TabConfig[] = [
    {path: 'basic', label: 'Basic Info'},
    {path: 'about', label: 'About'},
    {path: 'account', label: 'Account'},
    {path: 'admin', label: 'Admin'}
  ];

  submitting: boolean;
  dirty: boolean;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null;

  constructor(
    userViewState: UserViewStateService,
    private snackBar: MatSnackBar
  ) {
    super(userViewState);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.userViewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(s => this.submitting = s);
    this.userViewState.isDirty
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(d => this.dirty = d);
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }

  async onSave() {
    try {
      await this.userViewState.save();
    } catch (e) {
      this.snackBarRef = this.snackBar.open('Failed to save person', undefined, {
        duration: 3000
      });
      return;
    }
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  onDiscard() {
    this.userViewState.discard();
  }
}
