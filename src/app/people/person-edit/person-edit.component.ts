import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TitleAware } from '../../core/decorators';
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
})
@TitleAware()
export class PersonEditComponent extends AbstractPersonComponent implements OnInit {

  readonly allTabs: TabConfig[] = [
    {path: 'basic', label: 'Basic Info'},
    {path: 'about', label: 'About'},
    {path: 'account', label: 'Account'},
    {path: 'admin', label: 'Admin'},
  ];
  tabs: Observable<TabConfig[]>;

  submitting = this.userViewState.isSubmitting;
  dirty = this.userViewState.isDirty;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null;

  constructor(
    userViewState: UserViewStateService,
    private snackBar: MatSnackBar,
  ) {
    super(userViewState);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.tabs = this.user$.pipe(
      map(user => {
        let tabs = this.allTabs.slice();
        if (!user.canEditRoles) {
          tabs = tabs.filter(tab => tab.path !== 'admin');
        }
        if (!user.isSelf) {
          tabs = tabs.filter(tab => tab.path !== 'account');
        }

        return tabs;
      }),
    );
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }

  async onSave() {
    try {
      await this.userViewState.save();
    } catch (e) {
      this.snackBarRef = this.snackBar.open('Failed to save person', undefined, {
        duration: 3000,
      });
      return;
    }
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  onDiscard() {
    return this.userViewState.discard();
  }
}
