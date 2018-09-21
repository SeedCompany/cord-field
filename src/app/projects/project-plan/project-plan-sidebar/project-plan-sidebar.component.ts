import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Engagement } from '@app/core/models/engagement';
import { Project } from '@app/core/models/project';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-plan-sidebar',
  templateUrl: './project-plan-sidebar.component.html',
  styleUrls: ['./project-plan-sidebar.component.scss']
})
export class ProjectPlanSidebarComponent extends SubscriptionComponent implements OnInit {

  project: Project;

  constructor(private route: ActivatedRoute,
              private projectViewState: ProjectViewStateService,
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.projectViewState.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(project => this.project = project);
    if (this.project.engagements.length > 0) {
      this.router.navigate(
        ['.'],
        {
          relativeTo: this.route,
          queryParams: {
            engagementId: this.project.engagements[0].id
          }
        });
    }
  }

  trackById(index: number, engagement: Engagement) {
    return engagement.id;
  }

}
