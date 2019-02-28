import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import {
  EditableInternshipEngagement as EditableEngagement,
  InternshipEngagement as Engagement,
  InternshipEngagementPosition as Position,
  InternshipEngagementStatus as EngagementStatus,
  InternshipEngagementTag as EngagementTag,
} from '@app/core/models/internship';
import { ProductMethodology as Methodology } from '@app/core/models/product';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { InternshipService } from '@app/core/services/internship.service';
import { ExtractKeys, Omit, skipEmptyViewState, TypedFormGroup } from '@app/core/util';
import { FormGroupItemOptions } from '@app/core/view-state-form-builder';
import { EngagementViewStateService } from '@app/internships/engagement-view-state.service';
import { emptyOptions, StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm extends Omit<EditableEngagement, 'tags' | 'products'> {
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
  templateUrl: './internship-engagement.component.html',
  styleUrls: ['./internship-engagement.component.scss'],
  providers: [EngagementViewStateService],
})
@TitleAware()
export class InternshipEngagementComponent extends SubscriptionComponent implements OnInit, TitleProp, IsDirty {

  readonly EngagementStatus = EngagementStatus;
  readonly Position = Position;
  readonly Methodology = Methodology;

  private readonly _engagement = new BehaviorSubject<Engagement | undefined>(undefined);
  readonly engagement$: Observable<Engagement> = this._engagement.pipe(skipEmptyViewState());

  form: TypedFormGroup<EngagementForm>;
  isSubmitting = false;

  constructor(private route: ActivatedRoute,
              private viewState: EngagementViewStateService,
              private internships: InternshipService,
              private snackBar: MatSnackBar) {
    super();
  }

  get engagement() {
    return this._engagement.value;
  }

  get title() {
    return this.engagement$.pipe(
      map(e => e.intern.fullName),
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
      countryOfOrigin: {},
      mentor: {},
      position: {},
      methodologies: {},
      completeDate: {},
      disbursementCompleteDate: {},
      communicationsCompleteDate: {},
      isCeremonyPlanned: tagControl(EngagementTag.CeremonyPlanned),
      ceremonyEstimatedDate: {},
      ceremonyActualDate: {},
    });

    merge(
      this.engagement$.pipe(map(e => e.tags.includes(EngagementTag.CeremonyPlanned))),
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
    return this.engagement ? this.internships.getEngagementAvailableStatuses(this.engagement) : emptyOptions;
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
