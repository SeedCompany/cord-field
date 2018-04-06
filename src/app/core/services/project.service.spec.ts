import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { PloApiService } from './http/plo-api.service';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let projectService: ProjectService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProjectService,
        PloApiService
      ]
    });
    projectService = TestBed.get(ProjectService);
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));
  it('should get project list', done => {
    projectService
      .getProjects()
      .toPromise()
      .then((projects) => {
        expect(projects.length).not.toBe(0);
        expect(projects[0].id).toBeDefined();
        expect(projects[0].name).toBeDefined();
        expect(projects[0].languages).toBeDefined();
        expect(projects[0].status).toBeDefined();
        expect(projects[0].type).toBeDefined();
        expect(Array.isArray(projects[0].languages)).toBe(true);
      })
      .then(done)
      .catch(done.fail);
  });
});
