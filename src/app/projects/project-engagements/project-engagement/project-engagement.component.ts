import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import { EditableEngagement, Engagement, EngagementStatus } from '@app/core/models/engagement';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { EngagementService } from '@app/core/services/engagement.service';
import { enableControl, ExtractKeys, Omit } from '@app/core/util';
import { FormGroupItemOptions } from '@app/core/view-state-form-builder';
import { EngagementViewStateService } from '@app/projects/engagement-view-state.service';
import { popInOut } from '@app/shared/animations';
import { emptyOptions, StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { uniq } from 'lodash-es';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm extends Omit<EditableEngagement, 'tags' | 'products'> {
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isCeremonyPlanned: boolean;
}

type TagControl = FormGroupItemOptions<EngagementForm, Engagement, ExtractKeys<EngagementForm, boolean>, boolean>;

@Component({
  selector: 'app-project-engagement',
  templateUrl: './project-engagement.component.html',
  styleUrls: ['./project-engagement.component.scss'],
  animations: [popInOut],
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

    // This is hacky and only works because this is the only place tags are being modified.
    // Upside is it is generic so more tag controls can be added easily.
    let allTags: string[] = [];
    const tagControl = (tagName: string): TagControl => ({
      field: 'tags',
      initialValue: false,
      modelToForm: (tags: string[]): boolean => {
        allTags = tags;
        return tags.includes(tagName);
      },
      formToModel: (checked: boolean): string[] => {
        allTags = checked
          ? uniq([...allTags, tagName])
          : allTags.filter(tag => tag !== tagName);
        return allTags;
      },
    });

    this.form = this.viewState.fb.group<EngagementForm>(this.unsubscribe, {
      status: {},
      isLukePartnership: tagControl('luke_partnership'),
      isFirstScripture: tagControl('first_scripture'),
      completeDate: {},
      disbursementCompleteDate: {},
      communicationsCompleteDate: {},
      isCeremonyPlanned: tagControl('ceremony_planned'),
      ceremonyEstimatedDate: {},
      ceremonyActualDate: {},
    });

    merge(
      this.engagement$.pipe(map(e => e.hasTag('ceremony_planned'))),
      this.isCeremonyPlanned.valueChanges,
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(planned => {
        enableControl(this.ceremonyEstimatedDate, planned);
        enableControl(this.ceremonyActualDate, planned);
      });

    this.viewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(s => this.isSubmitting = s);
  }

  findAvailableStatuses = (status: EngagementStatus): StatusOptions<EngagementStatus> => {
    return this.engagement ? this.engagementService.getAvailableStatuses(this.engagement) : emptyOptions;
  };

  async onSave(): Promise<void> {
    this.form.disable();
    try {
      await this.viewState.save();
    } catch (err) {
      this.snackBar.open('Failed to save engagement', undefined, { duration: 3000 });
      return;
    } finally {
      this.form.enable();
    }
  }

  async onDiscard() {
    await this.viewState.discard();
  }
}
