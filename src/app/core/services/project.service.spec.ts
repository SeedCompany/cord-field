import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { ProjectCreationResult } from '../create-dialogs/project-create-dialog/project-create-dialog.component';
import { Project, ProjectStatus } from '../models/project';
import { ProjectService } from './project.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('ProjectService', () => {

  let httpMock: HttpTestingController;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule,
      ],
    });
    httpMock = TestBed.get(HttpTestingController);
    projectService = TestBed.get(ProjectService);
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  it('should get a project by id', (done: DoneFn) => {
    const id = '5acbba0c70db6a1781ece783';
    const url = `${testBaseUrl}/projects/${id}`;
    const mockResponse = {
      id: '5acbba0c70db6a1781ece783',
      status: ProjectStatus.Active,
      name: 'Elhomwe Bible',
      updatedAt: '2018-03-26T05:27:49.000Z',
      team: [],
    };

    projectService
      .getProject(id)
      .toPromise()
      .then((project: Project) => {
        expect(project.id).toBeDefined();
        expect(project.id).toBe('5acbba0c70db6a1781ece783');
        expect(project.name).toBeDefined();
        expect(project.name).toBe('Elhomwe Bible');
        expect(project.status).toBeDefined();
        expect(project.status).toBe(ProjectStatus.Active);
        expect(project.languages).toBeDefined();
      })
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(url)
      .flush(mockResponse);
    httpMock.verify();
  });

  it('should get project list', (done: DoneFn) => {

    const sort = 'updatedAt';
    const skip = 20;
    const limit = 10;
    const order = 'desc';
    const projectListUrl = `${testBaseUrl}/projects?sort=${sort}&order=${order}&limit=${limit}&skip=${skip}`;
    const mockResponse = [{
      id: '5acbba0c70db6a1781ece783',
      status: ProjectStatus.Active,
      name: 'Elhomwe Bible',
      updatedAt: '2018-03-26T05:27:49.000Z',
    }];

    projectService
      .getProjects({ all: true, sort: 'updatedAt', dir: 'desc', page: 3, size: limit, filters: {} })
      .toPromise()
      .then(({ data: projects, total }: { data: Project[], total: number }) => {
        expect(total).toBe(0);
        expect(projects.length).not.toBe(0);
        expect(projects[0].id).toBeDefined();
        expect(projects[0].id).toBe('5acbba0c70db6a1781ece783');
        expect(projects[0].name).toBeDefined();
        expect(projects[0].name).toBe('Elhomwe Bible');
        expect(projects[0].status).toBeDefined();
        expect(projects[0].status).toBe(ProjectStatus.Active);
        expect(projects[0].languages).toBeDefined();
        expect(Array.isArray(projects[0].languages)).toBe(true);
      })
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(projectListUrl)
      .flush(mockResponse);
    httpMock.verify();

  });

  it('check existing project name availability', (done: DoneFn) => {
    const mockResponse = {status: false};
    const isProjectNameUrl = `${testBaseUrl}/projects/exists?name=Elhomwe Bible`;
    projectService
      .isProjectNameTaken('Elhomwe Bible')
      .then((response) => {
        expect(response).toBe(false);
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(isProjectNameUrl)
      .flush(mockResponse);
    httpMock.verify();

  });

  it('create project', (done: DoneFn) => {
    const project: ProjectCreationResult = {
      name: 'newProject',
    };
    const mockResponse = {
      id: '5ace5faee23fc6685b6e40c6',
    };
    const projectUrl = `${testBaseUrl}/projects`;
    projectService
      .createProject(project)
      .then((id) => {
        expect(id).toBe('5ace5faee23fc6685b6e40c6');
        done();
      })
      .catch(done.fail);

    httpMock
      .expectOne(projectUrl)
      .flush(mockResponse);
    httpMock.verify();

  });
});
