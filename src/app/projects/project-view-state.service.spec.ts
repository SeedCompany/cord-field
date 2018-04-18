import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core/core.module';
import { Project } from '../core/models/project';

import { ProjectViewStateService } from './project-view-state.service';

describe('ProjectViewStateService', () => {
  let viewState: ProjectViewStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [ProjectViewStateService]
    });

    viewState = TestBed.get(ProjectViewStateService);
  });

  it('should be created', () => {
    expect(viewState).toBeTruthy();
  });

  it('initial project should be empty project', async () => {
    const project = await viewState.project.first().toPromise();
    expect(project instanceof Project).toBeTruthy();
  });
});
