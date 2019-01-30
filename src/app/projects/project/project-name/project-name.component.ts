import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar, MatSnackBarRef, ShowOnDirtyErrorStateMatcher, SimpleSnackBar } from '@angular/material';
import { ProjectService } from '@app/core/services/project.service';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { combineLatest, of } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss'],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class ProjectNameComponent extends SubscriptionComponent implements OnInit {

  name = new FormControl('', [Validators.required, Validators.minLength(2)]);
  editingTitle = false;
  private originalName: string;
  private preExistingName: string;
  private openedWithEnter = false;
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  // Angular doesn't persist errors when control removed & reinitialized in view.
  // Store them ourselves and re-apply them on initialization. smh.
  private serverErrors: any = null;
  @ViewChild(NgControl) set control(control: NgControl) {
    if (!control || !control.control || !this.serverErrors) {
      return;
    }
    setTimeout(() => {
      control.control!.setErrors(this.serverErrors);
    }, 0);
  }

  constructor(
    private projectViewState: ProjectViewStateService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    combineLatest(
      this.projectViewState.subject,
      this.projectViewState.subjectWithPreExistingChanges,
    )
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(([original, preExisting]) => {
        this.originalName = original.name;
        this.preExistingName = preExisting.name;
        this.name.reset(preExisting.name, { emitEvent: false });
      });

    const nameChanges = this.name
      .valueChanges
      .pipe(
        map(name => name.trim()),
      );
    nameChanges
      .pipe(
        filter(name => name.length > 1),
        debounceTime(500),
        filter(name => name !== this.originalName),
        filter(() => !this.name.hasError('required')), // Don't continue if user has already cleared the text
        tap(() => this.name.markAsPending()),
        switchMap(name =>
          this.projectService.isProjectNameTaken(name)
            .pipe(catchError(err => of(err)))),
        takeUntil(this.unsubscribe),
      )
      .subscribe((taken: boolean | HttpErrorResponse) => {
        if (this.name.hasError('required')) {
          // If we are here the response has been returned after the user cleared the field
          // Even if the name is available, we don't want to remove the required error.
          return;
        }
        this.name.markAsTouched(); // Be sure first error shows immediately instead of waiting for field to blur

        if (taken instanceof HttpErrorResponse) {
          this.showSnackBar('Failed to check project name availability');
          return;
        }

        this.serverErrors = taken ? { duplicate: true } : null;
        this.name.setErrors(this.serverErrors);

        if (taken) {
          this.projectViewState.revert('name');
          this.editingTitle = true;
        } else {
          this.preExistingName = this.name.value;
        }
      });

    nameChanges
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(name => {
        if (this.name.valid) {
          this.projectViewState.change({ name });
        } else {
          this.projectViewState.revert('name');
        }
      });
  }

  edit(event: MouseEvent) {
    this.editingTitle = true;
    this.openedWithEnter = event.clientX === 0 && event.clientY === 0;
  }

  @HostListener('keyup.esc')
  done() {
    if (this.name.pending) {
      return;
    }
    this.editingTitle = false;
    if (this.name.invalid) {
      this.name.setValue(this.preExistingName);
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

  private showSnackBar(message: string) {
    this.snackBarRef = this.snackBar.open(message, undefined, {
      duration: 3000,
    });
  }
}
