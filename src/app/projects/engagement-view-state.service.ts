import { Injectable } from '@angular/core';
import { EditableEngagement, EmptyEngagement, Engagement } from '@app/core/models/engagement';
import { Project } from '@app/core/models/project';
import { EngagementService } from '@app/core/services/engagement.service';
import { SessionStorageService } from '@app/core/services/storage.service';
import { filterRequired } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { first, map, takeUntil } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, dateConfig, returnId } from '../core/change-engine';

const config: ChangeConfig<EditableEngagement> = {
  status: {},
  products: {
    accessor: returnId,
    // Join modified list to the new complete list (obv excluding the removed items)
    toServer: (changes) => [
      ...(changes.update || []),
      ...(changes.add || []),
    ],
  },
  tags: {},
  completeDate: dateConfig,
  disbursementCompleteDate: dateConfig,
  communicationsCompleteDate: dateConfig,
  ceremonyEstimatedDate: dateConfig,
  ceremonyActualDate: dateConfig,
};

@Injectable()
export class EngagementViewStateService extends AbstractViewState<Engagement> {

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
        first(),
        map(project => project.engagements.find(e => e.id === id)),
        filterRequired(),
      )
      .subscribe(this.onLoad);
  };

  protected async onSave(original: Engagement, changes: Partial<EditableEngagement>): Promise<SaveResult<Engagement>> {
    const engagement = original.withChanges(changes);
    await this.engagementService.save(original.id, engagement);
    this.projectViewState.updateEngagement(engagement);
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
