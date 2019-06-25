import { Component } from '@angular/core';
import { TitleAware } from '@app/core/decorators';
import { Internship } from '@app/core/models/internship';
import { skipEmptyViewState } from '@app/core/util';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './internship-overview.component.html',
  styleUrls: ['./internship-overview.component.scss'],
})
@TitleAware('')
export class InternshipOverviewComponent {

  internship: Observable<Internship> = this.viewState.subject.pipe(skipEmptyViewState());

  constructor(
    private viewState: InternshipViewStateService,
  ) {
  }
}
