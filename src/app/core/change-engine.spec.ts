import { DateTime } from 'luxon';
import { accessDates, ChangeConfig, ChangeEngine, Changes, mapChangeList, returnId } from './change-engine';
import { Language } from './models/language';

interface TestSubject {
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  languages: Language[] | null;
}

describe('ChangeEngine', () => {
  let engine: ChangeEngine;
  let dirty: boolean;
  let subject: TestSubject;

  beforeEach(() => {
    engine = new ChangeEngine({
      mouStart: {
        accessor: accessDates,
        key: 'startDate'
      },
      mouEnd: {accessor: accessDates},
      languages: {
        accessor: returnId,
        toServer: mapChangeList<Language, string, string>(returnId, returnId),
        forceRefresh: true
      }
    } as ChangeConfig<keyof TestSubject>);
    engine.isDirty.subscribe(d => dirty = d);
  });

  function initializeSubject(initial: Partial<TestSubject> = {}) {
    subject = {
      mouStart: null,
      mouEnd: null,
      languages: null,
      ...initial
    };
  }

  function change(changes: Changes) {
    engine.change(changes, subject);
  }

  function expectModified(value: any) {
    // I don't want to expose the modified property so cast to any
    expect((engine as any).modified).toEqual(value);
  }

  describe('change()', () => {
    it('key not in change field config is ignored', () => {
      initializeSubject();

      change({
        updatedAt: DateTime.local(2018, 1, 2) // changed
      });
      expect(dirty).toBeFalsy();
      expectModified({});
    });

    describe('Single Item', () => {
      it('original value = clean', async () => {
        initializeSubject({
          mouStart: DateTime.local(2018, 1, 1)
        });

        change({
          mouStart: DateTime.local(2018, 1, 1)
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('original value -> different value = dirty', async () => {
        initializeSubject({
          mouStart: DateTime.local(2018, 1, 1),
          mouEnd: DateTime.local(2018, 3, 3)
        });

        change({
          mouStart: DateTime.local(2018, 1, 2), // changed
          mouEnd: DateTime.local(2018, 3, 3) // original
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouStart: DateTime.local(2018, 1, 2)
        });
      });
      it('original NULL value -> different value = dirty', () => {
        initializeSubject({
          mouStart: null
        });

        change({
          mouStart: DateTime.local(2018, 1, 2) // changed
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouStart: DateTime.local(2018, 1, 2)
        });
      });
      it('original value -> different NULL value = dirty', () => {
        initializeSubject({
          mouStart: DateTime.local(2018, 1, 1)
        });

        change({
          mouStart: null
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouStart: null
        });
      });

      it('different values add to modified object', async () => {
        initializeSubject({
          mouStart: DateTime.local(2018, 1, 1),
          mouEnd: DateTime.local(2018, 3, 3)
        });

        change({
          mouStart: DateTime.local(2018, 1, 2), // changed
          mouEnd: DateTime.local(2018, 3, 3) // original
        });

        change({
          mouStart: DateTime.local(2018, 1, 2), // not changed
          mouEnd: DateTime.local(2018, 3, 4) // changed
        });
        expect(dirty).toBeTruthy();
        // only test that asserts multiple values here
        expectModified({
          mouStart: DateTime.local(2018, 1, 2),
          mouEnd: DateTime.local(2018, 3, 4)
        });
      });

      it('different value -> revert to original value = clean', () => {
        initializeSubject({
          mouStart: DateTime.local(2018, 1, 1),
          mouEnd: DateTime.local(2018, 3, 3)
        });

        change({
          mouStart: DateTime.local(2018, 1, 2) // changed
        });
        change({
          mouStart: DateTime.local(2018, 1, 1) // changed & original
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('different value -> original NULL value = clean', () => {
        initializeSubject({
          mouStart: null
        });

        change({
          mouStart: DateTime.local(2018, 1, 2) // changed
        });
        change({
          mouStart: null // changed & original
        });

        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('two different values -> revert one value = dirty', () => {
        initializeSubject({
          mouStart: DateTime.local(2018, 1, 1),
          mouEnd: DateTime.local(2018, 3, 3)
        });

        change({
          mouStart: DateTime.local(2018, 1, 2), // changed
          mouEnd: DateTime.local(2018, 3, 4) // changed
        });
        change({
          mouStart: DateTime.local(2018, 1, 1), // changed & original
          mouEnd: DateTime.local(2018, 3, 4) // not changed
        });
        expect(dirty).toBeTruthy();
        expectModified({
          mouEnd: DateTime.local(2018, 3, 4)
        });
      });
    });

    describe('List', () => {
      it('add existing value = clean', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1'})
          ]
        });

        change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('add new value = dirty', () => {
        initializeSubject({
          languages: []
        });

        change({
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
        initializeSubject({
          languages: null
        });

        change({
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
        initializeSubject({
          languages: []
        });

        change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });

        change({
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
        initializeSubject({
          languages: []
        });

        change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('remove added value, but still other additions = dirty', () => {
        initializeSubject({
          languages: []
        });
        change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            add: Language.fromJson({id: '2'})
          }
        });

        change({
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
        initializeSubject({
          languages: [
            Language.fromJson({id: '1'})
          ]
        });

        change({
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
        initializeSubject({
          languages: [
            Language.fromJson({id: '1'})
          ]
        });

        change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('add removed value, but still other removals = dirty', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1'}),
            Language.fromJson({id: '2'})
          ]
        });
        change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            remove: Language.fromJson({id: '2'})
          }
        });

        change({
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

      it('update value that is already new = update added item', () => {
        initializeSubject({
          languages: []
        });

        change({
          languages: {
            add: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'good'})
          }
        });

        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            add: [
              Language.fromJson({id: '1', name: 'good'})
            ]
          }
        });
      });

      it('update value that is not in list = add new item', () => {
        initializeSubject({
          languages: []
        });

        change({
          languages: {
            update: Language.fromJson({id: '1'})
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

      it('update value = dirty', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1', name: 'bad'})
          ]
        });

        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'good'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'best'})
          }
        });

        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            update: [
              Language.fromJson({id: '1', name: 'best'})
            ]
          }
        });
      });

      it('update value already in list with no changes = clean', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1', name: 'good'})
          ]
        });

        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'good'})
          }
        });

        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('update value, revert with 2x update = clean', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1', name: 'bad'})
          ]
        });

        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'good'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'bad'})
          }
        });

        expect(dirty).toBeFalsy();
        expectModified({});
      });

      it('update value, revert with 2x update, but still other updates = dirty', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1', name: 'bad'}),
            Language.fromJson({id: '2', name: 'bad'})
          ]
        });

        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'good'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '2', name: 'good'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'bad'})
          }
        });

        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            update: [
              Language.fromJson({id: '2', name: 'good'})
            ]
          }
        });
      });

      it('remove, update = dirty', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1', name: 'bad'})
          ]
        });

        change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'good'})
          }
        });

        expect(dirty).toBeTruthy();
        expectModified({
          languages: {
            update: [
              Language.fromJson({id: '1', name: 'good'})
            ]
          }
        });
      });

      it('remove, update, revert = clean', () => {
        initializeSubject({
          languages: [
            Language.fromJson({id: '1', name: 'bad'})
          ]
        });

        change({
          languages: {
            remove: Language.fromJson({id: '1'})
          }
        });
        change({
          languages: {
            update: Language.fromJson({id: '1', name: 'bad'})
          }
        });

        expect(dirty).toBeFalsy();
        expectModified({});
      });
    });
  });

  it('reset()', () => {
    initializeSubject({
      mouStart: DateTime.local(2018, 1, 1),
      mouEnd: DateTime.local(2018, 3, 3)
    });
    change({
      mouStart: DateTime.local(2018, 1, 2), // changed
      mouEnd: DateTime.local(2018, 3, 4) // changed
    });

    engine.reset();

    expect(dirty).toBeFalsy();
    expectModified({});
  });

  it('getModifiedForServer()', () => {
    initializeSubject({
      languages: [
        Language.fromJson({id: '1'}),
        Language.fromJson({id: '2', name: 'bad'})
      ]
    });
    change({
      mouStart: DateTime.local(2018, 1, 2), // changed
      mouEnd: DateTime.local(2018, 3, 4), // changed
      languages: {
        remove: Language.fromJson({id: '1'}),
        update: Language.fromJson({id: '2', name: 'good'}),
        add: Language.fromJson({id: '3'})
      }
    });

    expect(engine.getModifiedForServer()).toEqual({
      startDate: DateTime.local(2018, 1, 2),
      mouEnd: DateTime.local(2018, 3, 4),
      languages: {
        remove: ['1'],
        update: ['2'],
        add: ['3']
      }
    });
  });

  it('getModified()', () => {
    initializeSubject({
      languages: [
        Language.fromJson({id: '1', name: 'bad'}),
        Language.fromJson({id: '2'}),
        Language.fromJson({id: '3'})
      ]
    });
    change({
      mouStart: DateTime.local(2018, 1, 2),
      languages: {
        add: Language.fromJson({id: '4'}),
        remove: Language.fromJson({id: '2'}),
        update: Language.fromJson({id: '1', name: 'good'})
      }
    });

    expect(engine.getModified(subject)).toEqual({
      mouStart: DateTime.local(2018, 1, 2),
      mouEnd: null,
      languages: [
        Language.fromJson({id: '1', name: 'good'}),
        Language.fromJson({id: '3'}),
        Language.fromJson({id: '4'})
      ]
    });
  });

  it('needsRefresh', () => {
    initializeSubject();

    change({
      mouStart: DateTime.local(2018, 1, 2)
    });
    expect(engine.needsRefresh).toBeFalsy();

    change({
      languages: {
        add: Language.fromJson({id: '4'})
      }
    });
    expect(engine.needsRefresh).toBeTruthy();
  });
});
