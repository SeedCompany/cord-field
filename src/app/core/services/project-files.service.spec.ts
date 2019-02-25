import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { Directory, FileNodeType } from '@app/core/models/files';
import { environment } from '../../../environments/environment';
import { CoreModule } from '../core.module';
import { ProjectFilesService } from './project-files.service';

const testBaseUrl = environment.services['plo.cord.bible'];

describe('ProjectFilesService', () => {

  let httpMock: HttpTestingController;
  let projectFilesService: ProjectFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CoreTestModule,
      ],
    });
    httpMock = TestBed.get(HttpTestingController);
    projectFilesService = TestBed.get(ProjectFilesService);
  });

  it('should be created', inject([ProjectFilesService], (service: ProjectFilesService) => {
    expect(service).toBeTruthy();
  }));

  it('should get project files list', (done: DoneFn) => {
    const projectId = '5acbba0c70db6a1781ece781';

    const mockResponse = {
      id: '5acbba0c70db6a1781ece783',
      type: FileNodeType.Directory,
      children: [{
        id: '5acbba0c70db6a1781ece783',
        type: 'dir',
        name: 'directory name',
        createdAt: '2018-08-14T15:50:30.842Z',
        owner: {
          displayFirstName: 'firstName',
          displayLastName: 'lastName',
          id: 'iBFFFGvBVlIpvsKVanrbIYVBaPwkDnhjjb0.n_cPm_zyG_7D7WWLDT7ozQ.zfUnrX9tXoPtWtDc9PLhUw',
        },
      }],
    };

    projectFilesService
      .getDirectory(projectId)
      .toPromise()
      .then((directory: Directory) => {
        const files = directory.children;
        expect(files.length).not.toBe(0);
        expect(files[0].id).toBeDefined();
        expect(files[0].id).toBe('5acbba0c70db6a1781ece783');
        expect(files[0].name).toBeDefined();
        expect(files[0].name).toBe('directory name');
        expect(files[0].type).toBeDefined();
        expect(files[0].type).toBe(FileNodeType.Directory);
        expect(files[0].owner).toBeDefined();
      })
      .then(done)
      .catch(done.fail);

    httpMock
      .expectOne(`${testBaseUrl}/projects/${projectId}/files`)
      .flush(mockResponse);
    httpMock.verify();
  });
});
