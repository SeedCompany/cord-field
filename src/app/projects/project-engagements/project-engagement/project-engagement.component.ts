import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import {
  Engagement,
  EngagementStatus,
  ModifiedEngagement,
  ProjectApproach,
  ProjectMedium,
  ProjectProduct,
} from '@app/core/models/engagement';
import { EngagementService } from '@app/core/services/engagement.service';
import { ProjectService } from '@app/core/services/project.service';
import { enableControl, filterRequired, log } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { popInOut } from '@app/shared/animations';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm {
  status: EngagementStatus;
  products: ProjectProduct[];
  mediums: ProjectMedium[];
  approaches: ProjectApproach[];
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
}

@Component({
  selector: 'app-project-engagement',
  templateUrl: './project-engagement.component.html',
  styleUrls: ['./project-engagement.component.scss'],
  animations: [popInOut],
})
@TitleAware()
export class ProjectEngagementComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly EngagementStatus = EngagementStatus;
  readonly ProjectApproach = ProjectApproach;
  readonly ProjectProduct = ProjectProduct;
  readonly ProjectMedium = ProjectMedium;

  private readonly _engagement = new BehaviorSubject<Engagement | undefined>(undefined);
  readonly engagement$: Observable<Engagement> = this._engagement.pipe(filterRequired());

  form = this.formBuilder.group({
    status: [],
    products: [[], Validators.required],
    mediums: [[], Validators.required],
    approaches: [[]],
    isLukePartnership: [false],
    isFirstScripture: [false],
    isDedicationPlanned: [false],
    dedicationDate: [null],
  });

  constructor(private route: ActivatedRoute,
              private engagementService: EngagementService,
              private formBuilder: FormBuilder,
              private projectViewState: ProjectViewStateService,
              private projectService: ProjectService,
              private router: Router,
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

  get isDedicationPlanned(): AbstractControl {
    return this.form.get('isDedicationPlanned')!;
  }

  get dedicationDate(): AbstractControl {
    return this.form.get('dedicationDate')!;
  }

  ngOnInit(): void {
    const project$ = this.projectViewState.project.pipe(takeUntil(this.unsubscribe));
    const id$ = this.route.params.pipe(map(({ id }) => id));
    combineLatest(project$, id$)
      .pipe(
        map(([project, id]) => project.engagements.find(e => e.id === id)),
      )
      .subscribe(this._engagement);

    this.engagement$.subscribe(engagement => {
      const {status, approaches, mediums, products, isDedicationPlanned, dedicationDate} = engagement;
      const value: EngagementForm = {
        status,
        approaches,
        mediums,
        products,
        isLukePartnership: engagement.tags.some(tag => tag === 'luke_partnership'),
        isFirstScripture: engagement.tags.some(tag => tag === 'first_scripture'),
        isDedicationPlanned,
        dedicationDate,
      };

      this.form.reset(value);
    });

    this.isDedicationPlanned.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(value => {
        enableControl(this.dedicationDate, value);
      });
  }

  findAvailableStatuses = (status: EngagementStatus): StatusOptions<EngagementStatus> => {
    return this.engagement ? this.projectService.getAvailableEngagementStatuses(this.engagement) : [];
  };

  async onSave(): Promise<void> {
    const engagement = this.engagement;
    if (!engagement) {
      return;
    }

    const {isLukePartnership, isFirstScripture, ...other} = this.form.value as EngagementForm;
    const value: ModifiedEngagement = {...other, tags: []};
    if (isLukePartnership) {
      value.tags.push('luke_partnership');
    }
    if (isFirstScripture) {
      value.tags.push('first_scripture');
    }

    this.form.disable();
    try {
      await this.engagementService.save(engagement.id, value);
    } catch (err) {
      this.snackBar.open('Failed to save engagement', undefined, { duration: 3000 });
      return;
    } finally {
      this.form.enable();
    }
    this.projectViewState.updateEngagement(engagement.withChanges(value));
  }

  onReset() {
    this.form.reset({});
  }
}
