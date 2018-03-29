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
  selectedIndex: number;
  private subscription: Subscription;

  readonly tabs: TabConfig[] = [
    {path: '', label: 'Overview'},
    {path: 'plan', label: 'Plan'},
    {path: 'budget', label: 'Budget'},
    {path: 'files', label: 'Files'},
    {path: 'people', label: 'People'},
    {path: 'updates', label: 'Updates'}
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.id = params.id;
      this.selectedIndex = Math.max(this.tabs.findIndex((item) => item.path === params.tab), 0);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onTabChange(index: number) {
    let path = this.tabs[index].path;
    path = path ? '/' + path : '';

    this.router.navigateByUrl(`/projects/${this.id}${path}`);
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }
}
