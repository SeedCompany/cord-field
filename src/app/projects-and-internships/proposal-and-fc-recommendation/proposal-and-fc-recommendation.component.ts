import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './proposal-and-fc-recommendation.component.html',
  styleUrls: ['./proposal-and-fc-recommendation.component.scss'],
})
export class ProposalAndFcRecommendationComponent {
  isInternship$ = this.route.data.pipe(map(data => Boolean(data.isInternship)));

  constructor(private route: ActivatedRoute) {
  }
}
