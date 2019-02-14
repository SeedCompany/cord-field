import { Component, OnInit } from '@angular/core';
import { Internship, InternshipStatus } from '@app/core/models/internship';
import { Sensitivity } from '@app/core/models/sensitivity';
import { InternshipService } from '@app/core/services/internship.service';
import { skipEmptyViewState, TypedFormGroup } from '@app/core/util';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { emptyOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

interface Form {
  sensitivity: Sensitivity;
  status: InternshipStatus;
}

@Component({
  selector: 'app-internship-overview-sidebar',
  templateUrl: './internship-overview-sidebar.component.html',
  styleUrls: ['./internship-overview-sidebar.component.scss'],
})
export class InternshipOverviewSidebarComponent extends SubscriptionComponent implements OnInit {
  readonly InternshipStatus = InternshipStatus;
  readonly Sensitivity = Sensitivity;

  form: TypedFormGroup<Form>;
  internship: Internship | null;

  constructor(
    private viewState: InternshipViewStateService,
    private internships: InternshipService,
  ) {
    super();
  }

  findAvailableStatuses = () => this.internship ? this.internships.getAvailableStatuses(this.internship) : emptyOptions;

  ngOnInit(): void {
    this.viewState.subject
      .pipe(skipEmptyViewState(), takeUntil(this.unsubscribe))
      .subscribe(i => this.internship = i);

    this.form = this.viewState.fb.group<Form>(this.unsubscribe, {
      status: {},
      sensitivity: {},
    });
  }
}
