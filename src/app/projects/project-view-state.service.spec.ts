import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { CoreModule } from '../core/core.module';
import { Language } from '../core/models/language';
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

    function initializeProject(initial: Partial<Project> | {languages: null} = {}) {
      for (const [key, value] of Object.entries(initial) as Array<[keyof Project, any]>) {
        project[key] = value;
      }
      viewState.onNewId('id');
    }

    describe('Single Item', () => {
      it('original value = clean', async () => {
        initializeProject({
          mouStart: new Date('1/1/2018')
        });

        viewState.change({
          mouStart: new Date('1/1/2018')
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('original value -> different value = dirty', async () => {
        initializeProject({
          mouStart: new Date('1/1/2018'),
          mouEnd: new Date('3/3/2018')
        });

        viewState.change({
          mouStart: new Date('1/2/2018'), // changed
          mouEnd: new Date('3/3/2018') // original
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouStart: new Date('1/2/2018')
        });
      });
      it('original NULL value -> different value = dirty', () => {
        initializeProject({
          mouStart: null
        });

        viewState.change({
          mouStart: new Date('1/2/2018') // changed
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouStart: new Date('1/2/2018')
        });
      });
      it('original value -> different NULL value = dirty', () => {
        initializeProject({
          mouStart: new Date('1/1/2018')
        });

        viewState.change({
          mouStart: null
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouStart: null
        });
      });

      it('different values add to modified object', async () => {
        initializeProject({
          mouStart: new Date('1/1/2018'),
          mouEnd: new Date('3/3/2018')
        });

        viewState.change({
          mouStart: new Date('1/2/2018'), // changed
          mouEnd: new Date('3/3/2018') // original
        });

        viewState.change({
          mouStart: new Date('1/2/2018'), // not changed
          mouEnd: new Date('3/4/2018') // changed
        });
        expect(dirty).toBeTruthy();
        // only test that asserts multiple values here
        expectModified({
          mouStart: new Date('1/2/2018'),
          mouEnd: new Date('3/4/2018')
        });
      });

      it('different value -> revert to original value = clean', () => {
        initializeProject({
          mouStart: new Date('1/1/2018'),
          mouEnd: new Date('3/3/2018')
        });

        viewState.change({
          mouStart: new Date('1/2/2018') // changed
        });
        viewState.change({
          mouStart: new Date('1/1/2018') // changed & original
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('different value -> original NULL value = clean', () => {
        initializeProject({
          mouStart: null
        });

        viewState.change({
          mouStart: new Date('1/2/2018') // changed
        });
        viewState.change({
          mouStart: null // changed & original
        });

        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('two different values -> revert one value = dirty', () => {
        initializeProject({
          mouStart: new Date('1/1/2018'),
          mouEnd: new Date('3/3/2018')
        });

        viewState.change({
          mouStart: new Date('1/2/2018'), // changed
          mouEnd: new Date('3/4/2018') // changed
        });
        viewState.change({
          mouStart: new Date('1/1/2018'), // changed & original
          mouEnd: new Date('3/4/2018') // not changed
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouEnd: new Date('3/4/2018')
        });
      });

      it('key not in change field config is ignored', () => {
        initializeProject();

        viewState.change({
          updatedAt: new Date('1/2/2018') // changed
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('discard changes', async () => {
        initializeProject({
          mouStart: new Date('1/1/2018'),
          mouEnd: new Date('3/3/2018')
        });
        viewState.change({
          mouStart: new Date('1/2/2018'), // changed
          mouEnd: new Date('3/4/2018') // changed
        });

        viewState.discard();

        expect(dirty).toBeFalsy();
        expectModified({});
        const p: Project = await viewState.project.first().toPromise();
        expect(p.mouStart).toEqual(new Date('1/1/2018'));
        expect(p.mouEnd).toEqual(new Date('3/3/2018'));
      });

      it('save changes', async () => {
        const service: ProjectService = TestBed.get(ProjectService);
        spyOn(service, 'save');

        initializeProject();
        viewState.change({
          mouStart: new Date('1/2/2018'), // changed
          mouEnd: new Date('3/4/2018') // changed
        });

        await viewState.save();

        expect(service.save).toHaveBeenCalledTimes(1);
        expect(dirty).toBeFalsy();
        expectModified({});
        const p: Project = await viewState.project.first().toPromise();
        expect(p.mouStart).toEqual(new Date('1/2/2018'));
        expect(p.mouEnd).toEqual(new Date('3/4/2018'));
      });
    });

    describe('List', () => {
      it('add existing value = clean', () => {
        initializeProject({
          languages: [
            Language.fromJson({id: '1'})
          ]
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('add new value = dirty', () => {
        initializeProject({
          languages: []
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            add: [
              Language.fromJson({id: '1'})
            ]
          }
        });
      });

      it('add new value (original NULL) = dirty', () => {
        initializeProject({
          languages: null
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            add: [
              Language.fromJson({id: '1'})
            ]
          }
        });
      });

      it('add new value twice = dirty', () => {
        initializeProject({
          languages: []
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '2'})
          }
        });
        expect(dirty).toBeTruthy();
        // only test that asserts multiple values here
        expectModified({
          languages: {
            add: [
              Language.fromJson({id: '1'}),
              Language.fromJson({id: '2'})
            ]
          }
        });
      });

      it('remove added value = clean', () => {
        initializeProject({
          languages: []
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        viewState.change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('remove added value, but still other additions = dirty', () => {
        initializeProject({
          languages: []
        });
        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        viewState.change({
          languages: {
            add: Language.fromJson({id: '2'})
          }
        });

        viewState.change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            add: [
              Language.fromJson({id: '2'})
            ]
          }
        });
      });

      it('remove existing value = dirty', () => {
        initializeProject({
          languages: [
            Language.fromJson({id: '1'})
          ]
        });

        viewState.change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            remove: [
              Language.fromJson({id: '1'})
            ]
          }
        });
      });

      it('add removed value = clean', () => {
        initializeProject({
          languages: [
            Language.fromJson({id: '1'})
          ]
        });

        viewState.change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('add removed value, but still other removals = dirty', () => {
        initializeProject({
          languages: [
            Language.fromJson({id: '1'}),
            Language.fromJson({id: '2'})
          ]
        });
        viewState.change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        viewState.change({
          languages: {
            remove: Language.fromJson({id: '2'})
          }
        });

        viewState.change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            remove: [
              Language.fromJson({id: '2'})
            ]
          }
        });
      });

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
});
