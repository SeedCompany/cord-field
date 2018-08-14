import { inject, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { FileList, FileNodeType } from '../models/file-node';
import { ProjectFilesService } from './project-files.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('ProjectFilesService', () => {

  let httpMock: HttpTestingController;
  let projectFilesService: ProjectFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    projectFilesService = TestBed.get(ProjectFilesService);
  });

  it('should be created', inject([ProjectFilesService], (service: ProjectFilesService) => {
    expect(service).toBeTruthy();
  }));

  it('should get project files list', (done: DoneFn) => {
    const projectId = '5acbba0c70db6a1781ece781';
    const sort = 'createdAt';
    const parentId = '';
    const skip = 0;
    const limit = 10;
    const order = 'desc';
    const ProjectFilesleUrl = `${testBaseUrl}/projects/${projectId}/files?sort=${sort}&skip=${skip}&limit=${limit}&order=${order}`;

    const mockResponse = [{
      id: '5acbba0c70db6a1781ece783',
      type: 'd',
      name: 'directory name',
      createdAt: '2018-08-14T15:50:30.842Z',
      owner: {
        displayFirstName: 'firstName',
        displayLastName: 'lastName',
        id: 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw'
      },
      size: 1234455
    }];

    projectFilesService
      .getFiles(projectId, parentId, 'createdAt', 'desc', 0, 10)
      .toPromise()
      .then((filesWithCount: FileList) => {
        const files = filesWithCount.files;
        expect(filesWithCount.total).toBe(0);
        expect(files.length).not.toBe(0);
        expect(files[0].id).toBeDefined();
        expect(files[0].id).toBe('5acbba0c70db6a1781ece783');
        expect(files[0].name).toBeDefined();
        expect(files[0].name).toBe('directory name');
        expect(files[0].type).toBeDefined();
        expect(files[0].type).toBe(FileNodeType.Directory);
        expect(files[0].size).toBeDefined();
        expect(files[0].size).toBe(null);
        expect(files[0].owner).toBeDefined();
      })
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(ProjectFilesleUrl)
      .flush(mockResponse);
    httpMock.verify();

  });
});
