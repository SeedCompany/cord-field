import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserViewStateService } from '../user-view-state.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
  providers: [UserViewStateService]
})
export class PersonComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  constructor(
    private userViewState: UserViewStateService,
    private route: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.userViewState.next(params.id);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
