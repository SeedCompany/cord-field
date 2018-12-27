import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

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

  constructor(
    private projectViewState: ProjectViewStateService,
  ) {
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

    this.name.valueChanges
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
}
