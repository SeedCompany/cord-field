import { Injectable } from '@angular/core';
import { Product } from '@app/core/models/product';
import {
  EditableProjectEngagement as EditableEngagement,
  EmptyProjectEngagement as EmptyEngagement,
  Project,
  ProjectEngagement as Engagement,
  ProjectEngagementTag,
} from '@app/core/models/project';
import { ProjectEngagementService as EngagementService } from '@app/core/services/project-engagement.service';
import { SessionStorageService } from '@app/core/services/storage.service';
import { filterRequired, skipEmptyViewState } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { first, map, takeUntil } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, dateConfig } from '../core/change-engine';

const config: ChangeConfig<EditableEngagement> = {
  status: {},
  products: Product.fieldConfigList(),
  tags: ProjectEngagementTag.fieldConfigList,
  completeDate: dateConfig,
  disbursementCompleteDate: dateConfig,
  communicationsCompleteDate: dateConfig,
  ceremonyEstimatedDate: dateConfig,
  ceremonyActualDate: dateConfig,
};

@Injectable()
export class EngagementViewStateService extends AbstractViewState<Engagement, Partial<EditableEngagement>> {

  private project: Project;

  constructor(
    storage: SessionStorageService,
    private engagementService: EngagementService,
    private projectViewState: ProjectViewStateService,
  ) {
    super(config, EmptyEngagement, storage);

    this.projectViewState.subject
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(p => this.project = p);
  }

  onNewId = (id: string) => {
    this.projectViewState.project
      .pipe(
        skipEmptyViewState(),
        first(),
        map(project => project.engagements.find(e => e.id === id)),
        filterRequired(),
      )
      .subscribe(this.onLoad);
  };

  protected async onSave(next: Engagement, changes: Partial<EditableEngagement>): Promise<SaveResult<Engagement>> {
    await this.engagementService.save(next.id, changes);
    this.projectViewState.updateEngagement(next);
    return {};
  }

  protected refresh(engagement: Engagement): void {
  }

  protected identify(engagement: Engagement): string {
    if (!this.project || !this.project.id) {
      throw new Error('Trying to identify engagement without project');
    }
    return `engagement-${this.project.id}-${engagement.language.nameOrDisplayName}`;
  }
}
