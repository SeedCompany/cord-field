import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware } from '@app/core/decorators';
import { Engagement } from '@app/core/models/engagement';
import { filter } from 'rxjs/operators';
import { ProjectTabComponent } from '../abstract-project-tab';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-plan',
  templateUrl: './project-engagements.component.html',
  styleUrls: ['./project-engagements.component.scss']
})
@TitleAware('Engagements')
export class ProjectEngagementsComponent extends ProjectTabComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    projectViewState: ProjectViewStateService
  ) {
    super(projectViewState);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Redirect to first engagement when project loads, as long as
    // it has engagements and there is not only one currently selected
    // or the one selected doesn't exist in project (encrypted id)
    this.project$
      .pipe(filter(project => {
        if (project.engagements.length === 0) {
          return false;
        }

        if (this.route.firstChild) {
          const currentId = this.route.firstChild.snapshot.params.id;
          return !project.engagements.some(e => e.id === currentId);
        }

        return true;
        }
      ))
      .subscribe(project => {
        this.router.navigate(
          [project.engagements[0].id],
          {
            replaceUrl: true,
            relativeTo: this.route
          }
        );
    });
  }

  trackById(index: number, engagement: Engagement) {
    return engagement.id;
  }
}
