import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import {
  EditableProjectEngagement as EditableEngagement,
  ProjectEngagement as Engagement,
  ProjectEngagementStatus as EngagementStatus,
  ProjectEngagementTag as EngagementTag,
} from '@app/core/models/project';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { ProjectEngagementService as EngagementService } from '@app/core/services/project-engagement.service';
import { ExtractKeys, Omit } from '@app/core/util';
import { FormGroupItemOptions } from '@app/core/view-state-form-builder';
import { EngagementViewStateService } from '@app/projects/engagement-view-state.service';
import { emptyOptions, StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm extends Omit<EditableEngagement, 'tags' | 'products'> {
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isCeremonyPlanned: boolean;
}

const tagControl = (tagName: EngagementTag): TagControl => ({
  field: 'tags',
  initialValue: false,
  modelToForm: (tags: EngagementTag[]) => tags.includes(tagName),
  formToChange: (checked: boolean) => ({ [checked ? 'add' : 'remove']: tagName }),
});
type TagControl = FormGroupItemOptions<Engagement, ExtractKeys<EngagementForm, boolean>, boolean>;

@Component({
  selector: 'app-project-engagement',
  templateUrl: './project-engagement.component.html',
  styleUrls: ['./project-engagement.component.scss'],
  providers: [EngagementViewStateService],
})
@TitleAware()
export class ProjectEngagementComponent extends SubscriptionComponent implements OnInit, TitleProp, IsDirty {

  readonly EngagementStatus = EngagementStatus;

  private readonly _engagement = new BehaviorSubject<Engagement | undefined>(undefined);
  readonly engagement$: Observable<Engagement> = this._engagement.pipe(
    filter((e): e is Engagement => Boolean(e) && Boolean(e!.id)),
  );

  form: FormGroup;
  isSubmitting = false;

  constructor(private route: ActivatedRoute,
              private viewState: EngagementViewStateService,
              private engagementService: EngagementService,
              private snackBar: MatSnackBar) {
    super();
  }

  get engagement() {
    return this._engagement.value;
  }

  get title() {
    return this.engagement$.pipe(
      map(e => e.language.displayName),
      startWith(''),
    );
  }

  get isDirty() {
    return this.viewState.isDirty;
  }

  get completeDate(): AbstractControl {
    return this.form.get('completeDate')!;
  }

  get disbursementCompleteDate(): AbstractControl {
    return this.form.get('disbursementCompleteDate')!;
  }

  get communicationsCompleteDate(): AbstractControl {
    return this.form.get('communicationsCompleteDate')!;
  }

  get isCeremonyPlanned(): AbstractControl {
    return this.form.get('isCeremonyPlanned')!;
  }

  get ceremonyEstimatedDate(): AbstractControl {
    return this.form.get('ceremonyEstimatedDate')!;
  }

  get ceremonyActualDate(): AbstractControl {
    return this.form.get('ceremonyActualDate')!;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(map(({ id }) => id))
      .subscribe(this.viewState.onNewId);
    this.viewState.subjectWithPreExistingChanges
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(this._engagement);

    this.form = this.viewState.fb.group<EngagementForm>(this.unsubscribe, {
      status: {},
      isLukePartnership: tagControl(EngagementTag.LukePartnership),
      isFirstScripture: tagControl(EngagementTag.FirstScripture),
      completeDate: {},
      disbursementCompleteDate: {},
      communicationsCompleteDate: {},
      isCeremonyPlanned: tagControl(EngagementTag.CeremonyPlanned),
      ceremonyEstimatedDate: {},
      ceremonyActualDate: {},
    });

    merge(
      this.engagement$.pipe(map(e => e.hasTag(EngagementTag.CeremonyPlanned))),
      this.isCeremonyPlanned.valueChanges,
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(planned => {
        for (const control of [this.ceremonyEstimatedDate, this.ceremonyActualDate]) {
          if (planned) {
            control.enable({ emitEvent: false });
          } else {
            control.reset();
            control.disable({ emitEvent: false });
          }
        }
      });

    this.viewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(s => this.isSubmitting = s);
  }

  findAvailableStatuses = (status: EngagementStatus): StatusOptions<EngagementStatus> => {
    return this.engagement ? this.engagementService.getAvailableStatuses(this.engagement) : emptyOptions;
  };

  async onSave(): Promise<void> {
    try {
      await this.viewState.save();
    } catch (err) {
      this.snackBar.open('Failed to save engagement', undefined, { duration: 3000 });
      return;
    }
  }

  async onDiscard() {
    await this.viewState.discard();
  }
}
