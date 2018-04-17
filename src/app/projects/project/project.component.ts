import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Project } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';

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
  project = new Project();

  dirty = true;

  private idSub = Subscription.EMPTY;

  readonly tabs: TabConfig[] = [
    {path: '/overview', label: 'Overview'},
    {path: '/plan', label: 'Plan'},
    {path: '/budget', label: 'Budget'},
    {path: '/files', label: 'Files'},
    {path: '/people', label: 'People'},
    {path: '/updates', label: 'Updates'}
  ];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.projectService.getProject(this.id).subscribe(project => this.project = project);
    });
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }

  onSave() {
    this.dirty = false;
  }

  onDiscard() {
    this.dirty = false;
  }
}
