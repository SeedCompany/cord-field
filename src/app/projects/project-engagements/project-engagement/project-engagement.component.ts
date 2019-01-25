import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import { EditableEngagement, Engagement, EngagementStatus } from '@app/core/models/engagement';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { EngagementService } from '@app/core/services/engagement.service';
import { enableControl, Omit } from '@app/core/util';
import { EngagementViewStateService } from '@app/projects/engagement-view-state.service';
import { popInOut } from '@app/shared/animations';
import { emptyOptions, StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm extends Omit<EditableEngagement, 'tags' | 'products'> {
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isCeremonyPlanned: boolean;
}

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

  form = this.formBuilder.group({
    status: [],
    isLukePartnership: [false],
    isFirstScripture: [false],
    completeDate: [null],
    disbursementCompleteDate: [null],
    communicationsCompleteDate: [null],
    isCeremonyPlanned: [false],
    ceremonyEstimatedDate: [null],
    ceremonyActualDate: [null],
  });
  isSubmitting = false;

  constructor(private route: ActivatedRoute,
              private viewState: EngagementViewStateService,
              private engagementService: EngagementService,
              private formBuilder: FormBuilder,
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

    this.engagement$
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(engagement => {
        const { id, language, possibleStatuses, updatedAt, tags, initialEndDate, currentEndDate, products, ...editable } = engagement;
        const value: EngagementForm = {
          ...editable,
          isLukePartnership: engagement.hasTag('luke_partnership'),
          isFirstScripture: engagement.hasTag('first_scripture'),
          isCeremonyPlanned: engagement.hasTag('ceremony_planned'),
        };
        this.form.reset(value, { emitEvent: false });
      });

    this.form.valueChanges
      .pipe(
        map((formVal: EngagementForm) => {
          const {
            isLukePartnership,
            isFirstScripture,
            isCeremonyPlanned,
            ...other
          } = formVal;
          const value: Omit<EditableEngagement, 'products'> = { ...other, tags: [] };
          if (isLukePartnership) {
            value.tags.push('luke_partnership');
          }
          if (isFirstScripture) {
            value.tags.push('first_scripture');
          }
          if (isCeremonyPlanned) {
            value.tags.push('ceremony_planned');
          }

          return value;
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe(changes => this.viewState.change(changes));

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
