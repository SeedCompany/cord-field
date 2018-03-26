import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

interface TabConfig {
  path: string;
  label: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  id: string;
  selectedTab: number;

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
    this.id = this.route.snapshot.paramMap.get('id');
    const tab = this.route.snapshot.paramMap.get('tab');
    this.selectedTab = Math.min(this.tabs.findIndex((item) => item.path === tab), 0);
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
    const path = this.tabs[this.selectedTab].path;
    this.router.navigateByUrl(`/projects/${this.id}/${path}`);
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }
}
