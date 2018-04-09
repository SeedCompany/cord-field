import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

interface TabConfig {
  path: string;
  label: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  id: string;
  private idSub = Subscription.EMPTY;

  readonly tabs: TabConfig[] = [
    {path: '', label: 'Overview'},
    {path: '/plan', label: 'Plan'},
    {path: '/budget', label: 'Budget'},
    {path: '/files', label: 'Files'},
    {path: '/people', label: 'People'},
    {path: '/updates', label: 'Updates'}
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }
}
