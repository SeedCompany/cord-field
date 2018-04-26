import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

export abstract class ProjectTabComponent implements OnInit, OnDestroy {

  public id: string;
  private idSub = Subscription.EMPTY;

  constructor(protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.idSub = this.route.parent!.params.subscribe(params => {
      this.id = params.id;
      this.onId(this.id);
    });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  /**
   * Override this to do logic with project ID.
   */
  onId(id: string): void {
  }
}
