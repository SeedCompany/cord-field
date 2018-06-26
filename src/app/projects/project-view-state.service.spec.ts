import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs/Observable';
import { CoreModule } from '../core/core.module';
import { Language } from '../core/models/language';
import { Location } from '../core/models/location';
import { Project } from '../core/models/project';
import { ProjectService } from '../core/services/project.service';
import { ProjectViewStateService } from './project-view-state.service';

describe('ProjectViewStateService', () => {
  let viewState: ProjectViewStateService;
  const project = Project.fromJson({id: 'id'});

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        ProjectViewStateService
      ]
    });

    viewState = TestBed.get(ProjectViewStateService);
    spyOn(TestBed.get(ProjectService), 'getProject').and.returnValue(Observable.of(project));
  });

  function initializeProject(initial: Partial<Project> | {languages: null} = {}) {
    for (const [key, value] of Object.entries(initial) as Array<[keyof Project, any]>) {
      project[key] = value;
    }
    viewState.onNewId('id');
  }

  it('should be created', () => {
    expect(viewState).toBeTruthy();
  });

  it('initial project should be empty project', async () => {
    const p: Project = await viewState.project.first().toPromise();
    expect(p instanceof Project).toBeTruthy();
  });

  it('Given new project ID -> fetch project', async () => {
    viewState.onNewId('id');
    const p: Project = await viewState.project.first().toPromise();
    expect(p instanceof Project).toBeTruthy();
    expect(p.id).toBe('id');
  });

  describe('Change Tracking', () => {
    let dirty: boolean;
    beforeEach(() => {
      viewState.isDirty.subscribe(d => dirty = d);
    });

    function expectModified(value: any) {
      // I don't want to expose the modified property so cast to any
      expect((viewState as any).modified).toEqual(value);
    }

    describe('Single Item', () => {
      it('discard changes', async () => {
        initializeProject({
          mouStart: DateTime.local(2018, 1, 1),
          mouEnd: DateTime.local(2018, 3, 3)
        });
        viewState.change({
          mouStart: DateTime.local(2018, 1, 2), // changed
          mouEnd: DateTime.local(2018, 3, 4) // changed
        });

        viewState.discard();

        expect(dirty).toBeFalsy();
        expectModified({});
        const p: Project = await viewState.project.first().toPromise();
        expect(p.mouStart).toEqual(DateTime.local(2018, 1, 1));
        expect(p.mouEnd).toEqual(DateTime.local(2018, 3, 3));
      });

      it('save changes', async () => {
        const service: ProjectService = TestBed.get(ProjectService);
        spyOn(service, 'save');

        initializeProject();
        viewState.change({
          mouStart: DateTime.local(2018, 1, 2), // changed
          mouEnd: DateTime.local(2018, 3, 4) // changed
        });

        await viewState.save();

        expect(service.save).toHaveBeenCalledTimes(1);
        expect(dirty).toBeFalsy();
        expectModified({});
        const p: Project = await viewState.project.first().toPromise();
        expect(p.mouStart).toEqual(DateTime.local(2018, 1, 2));
        expect(p.mouEnd).toEqual(DateTime.local(2018, 3, 4));
      });
    });

    describe('List', () => {
      it('discard changes', async () => {
        initializeProject({
          languages: [
             Language.fromJson({id: '1'}),
             Language.fromJson({id: '2'})
          ]
        });
        viewState.change({
          languages: {
            add: Language.fromJson({id: '3'}),
            remove: Language.fromJson({id: '1'})
          }
        });

        viewState.discard();

        expect(dirty).toBeFalsy();
        expectModified({});
        const p: Project = await viewState.project.first().toPromise();
        expect(p.languages).toEqual([
          Language.fromJson({id: '1'}),
          Language.fromJson({id: '2'})
        ]);
      });

      it('save changes', async () => {
        const service: ProjectService = TestBed.get(ProjectService);
        spyOn(service, 'save');

        initializeProject({
          languages: [
            Language.fromJson({id: '1'}),
            Language.fromJson({id: '2'})
          ]
        });
        viewState.change({
          languages: {
            add: Language.fromJson({id: '3'}),
            remove: Language.fromJson({id: '1'})
          }
        });

        await viewState.save();

        expect(service.save).toHaveBeenCalledTimes(1);
        expect(dirty).toBeFalsy();
        expectModified({});
        const p: Project = await viewState.project.first().toPromise();
        expect(p.languages).toEqual([
          Language.fromJson({id: '2'}),
          Language.fromJson({id: '3'})
        ]);
      });
    });
  });

  describe('Force Refresh', () => {
    it('Should call getProject when change with forceRefresh is saved',   async () => {
      const service: ProjectService = TestBed.get(ProjectService);
      spyOn(service, 'save');
      initializeProject({
        location: Location.fromJson({id: 'xyz'})
      });
      viewState.change({
        location: Location.fromJson({id: 'abc'})
      });
      await viewState.save();
      expect(service.getProject).toHaveBeenCalledTimes(2);
    });

    it('Should not call getProject when change that does not have forceRefresh is saved', async () => {
      const service: ProjectService = TestBed.get(ProjectService);
      spyOn(service, 'save');
      initializeProject({
        mouStart: DateTime.local(2018, 1, 1)
      });

      viewState.change({
        mouStart: DateTime.local(2018, 3, 3)
      });
      await viewState.save();
      expect(service.getProject).toHaveBeenCalledTimes(1);
    });
  });
});
