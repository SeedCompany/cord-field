import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '@app/core/decorators';
import { InternshipEngagement } from '@app/core/models/internship';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './internship-engagements.component.html',
  styleUrls: ['./internship-engagements.component.scss'],
})
@TitleAware('Plan')
export class InternshipEngagementsComponent extends SubscriptionComponent implements OnInit {

  internship$ = this.viewState.subject;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewState: InternshipViewStateService,
  ) {
    super();
  }

  ngOnInit(): void {
    // Redirect to first engagement when project loads, as long as
    // it has engagements and there is not only one currently selected
    // or the one selected doesn't exist in project (encrypted id)
    this.viewState.subject
      .pipe(
        filter(internship => {
          if (internship.engagements.length === 0) {
            return false;
          }

          if (this.route.firstChild) {
            const currentId = this.route.firstChild.snapshot.params.id;
            return !internship.engagements.some(e => e.id === currentId);
          }

          return true;
          },
        ),
        takeUntil(this.unsubscribe),
      )
      .subscribe(internship => {
        this.router.navigate(
          [internship.engagements[0].id],
          {
            replaceUrl: true,
            relativeTo: this.route,
          },
        );
    });
  }

  trackById(index: number, engagement: InternshipEngagement) {
    return engagement.id;
  }
}
