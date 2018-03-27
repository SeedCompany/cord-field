import { inject, TestBed } from '@angular/core/testing';
import { ProjectSearchService } from './project-search.service';

describe('ProjectSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectSearchService
      ]
    });
  });

  it('should be created', inject([ProjectSearchService], (service: ProjectSearchService) => {
    expect(service).toBeTruthy();
  }));
});
