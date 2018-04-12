import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { PloApiService } from './http/plo-api.service';
import { ProjectService } from './project.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('ProjectService', () => {

  let httpMockService: HttpTestingController;
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
    httpMockService = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  it('should get project list', done => {

    const sort = 'updatedAt';
    const skip = 0;
    const limit = 10;
    const order = 'desc';
    const projectListUrl = `${testBaseUrl}/projects?sort=${sort}&skip=${skip}&limit=${limit}&order=${order}`;
    const mockResponse = [{
      'id': '5acbba0c70db6a1781ece783',
      'status': 'active',
      'name': 'Elhomwe Bible (395)',
      'updatedAt': '2018-03-26T05:27:49.000Z',
      'type': 'translation'
    }];

    projectService
      .getProjects('updatedAt', 'desc', 0, 10)
      .toPromise()
      .then((projectsWithCount) => {
        const projects = projectsWithCount.projects;
        expect(projectsWithCount.count).toBe(0);
        expect(projects.length).not.toBe(0);
        expect(projects[0].id).toBeDefined();
        expect(projects[0].id).toBe('5acbba0c70db6a1781ece783');
        expect(projects[0].name).toBeDefined();
        expect(projects[0].name).toBe('Elhomwe Bible (395)');
        expect(projects[0].status).toBeDefined();
        expect(projects[0].status).toBe('active');
        expect(projects[0].type).toBeDefined();
        expect(projects[0].type).toBe('translation');
        expect(projects[0].languages).toBeDefined();
        expect(Array.isArray(projects[0].languages)).toBe(true);
      })
      .then(done)
      .catch(done.fail);

    httpMockService
      .expectOne(projectListUrl)
      .flush(mockResponse);
    httpMockService.verify();

  });
});
