import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar, MatSnackBarRef, ShowOnDirtyErrorStateMatcher, SimpleSnackBar } from '@angular/material';
import { ProjectService } from '@app/core/services/project.service';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { from as observableFrom } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss'],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class ProjectNameComponent extends SubscriptionComponent implements OnInit {

  name = new FormControl('', [Validators.required]);
  editingTitle = false;
  private original: string;
  private openedWithEnter = false;
  private snackBarRef?: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private projectViewState: ProjectViewStateService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.projectViewState.subjectWithPreExistingChanges
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(project => {
        this.original = project.name;
        this.name.reset(project.name, { emitEvent: false });
      });

    this.name
      .valueChanges
      .pipe(
        map(name => name.trim()),
        filter(name => name.length > 1),
        debounceTime(500),
        distinctUntilChanged(),
        filter(() => !this.name.hasError('required')), // Don't continue if user has already cleared the text
        tap(() => this.name.markAsPending()),
        switchMap(name => {
          if (this.name.valid) {
            this.projectViewState.change({name});
          } else {
            this.projectViewState.revert('name');
          }
          return observableFrom(this.projectService.isProjectNameTaken(name))
            .pipe(catchError<boolean, HttpErrorResponse>(err => err));
        }),
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

        this.name.setErrors(taken ? {duplicate: true} : null);
      });


  }

  edit(event: MouseEvent) {
    this.editingTitle = true;
    this.openedWithEnter = event.clientX === 0 && event.clientY === 0;
  }

  @HostListener('keyup.esc')
  done() {
    this.editingTitle = false;
    if (this.name.invalid) {
      this.name.reset(this.original, { emitEvent: false });
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
