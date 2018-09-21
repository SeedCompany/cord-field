import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Engagement, ProjectApproach, ProjectEngagement, ProjectMedium, ProjectProduct } from '@app/core/models/engagement';
import { EngagementService } from '@app/core/services/engagement.service';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';

@Component({
  selector: 'app-project-plan-language-engagement',
  templateUrl: './project-plan-language-engagement.component.html',
  styleUrls: ['./project-plan-language-engagement.component.scss']
})
export class ProjectPlanLanguageEngagementComponent extends SubscriptionComponent implements OnInit {

  readonly ProjectApproach = ProjectApproach;
  readonly ProjectProduct = ProjectProduct;
  readonly ProjectMedium = ProjectMedium;
  readonly ProjectEngagement = ProjectEngagement;

  form: FormGroup;
  engagement: Engagement;

  constructor(private route: ActivatedRoute,
              private engagementService: EngagementService,
              private formBuilder: FormBuilder,
              private projectViewState: ProjectViewStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
    super();
    this.initForm();
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const {engagementId} = params;
      if (engagementId) {
        this.setFormData(engagementId);
      }
    });
    this.isDedicationPlanned.valueChanges.subscribe(checked => {
      if (!checked) {
        this.dedicationDate.setValue(null);
        this.dedicationDate.disable();
        return;
      }
      this.dedicationDate.patchValue(this.engagement.dedicationDate || null);
      this.dedicationDate.enable();
    });
  }

  get isDedicationPlanned(): AbstractControl {
    return this.form.get('isDedicationPlanned')!;
  }

  get dedicationDate(): AbstractControl {
    return this.form.get('dedicationDate')!;
  }

  async setFormData(id: string): Promise<void> {
    try {
      this.engagement = await this.engagementService.getEngagement(id);
      this.form.reset(this.engagement);
      if (this.engagement.dedicationDate) {
        this.isDedicationPlanned.setValue(true);
        this.dedicationDate.enable();
      }
    } catch (e) {
      this.snackBar.open('Failed to fetch Engagement', undefined, {duration: 3000});
    }
  }

  async update(): Promise<void> {
    try {
      await this.engagementService.save(this.engagement.id, this.form.value);
      await this.setFormData(this.engagement.id);
    } catch (err) {
      this.snackBar.open('Failed to update Engagement', undefined, {duration: 3000});
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      products: ['', Validators.required],
      mediums: ['', Validators.required],
      approach: [''],
      isLukePartnership: [''],
      isFirstScripture: [''],
      isDedicationPlanned: [''],
      dedicationDate: ['']
    });
  }
}
