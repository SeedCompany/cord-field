import { gql, InMemoryCache, TypePolicies } from '@apollo/client';
import { typePolicies } from '../../schema/typePolicies';
import { addItemToList } from './addItemToList';
import { removeItemFromList } from './removeItemFromList';

// Regression tests for the "Cannot read properties of undefined (reading 'some')"
// crash on Create Engagement. List fields with no merge policy (e.g.
// Language.projects) store exactly what a query selected. LanguageDetail only
// selects `projects { canRead }`, so after visiting a language page the cache
// holds a list object with no `items`. The list modifiers must tolerate that
// shape instead of crashing the whole mutation update.

const language = { __typename: 'Language', id: 'lang-1' } as const;
const project = {
  __typename: 'MomentumTranslationProject',
  id: 'proj-1',
} as const;
const newEngagement = {
  __typename: 'LanguageEngagement',
  id: 'eng-new',
} as const;

const makeCache = () => {
  const cache = new InMemoryCache({
    typePolicies: typePolicies as TypePolicies,
  });

  // What LanguageDetail leaves in the cache — perms only, no items.
  cache.writeFragment({
    id: cache.identify(language)!,
    fragment: gql`
      fragment TestLanguageProjects on Language {
        projects {
          canRead
        }
      }
    `,
    data: {
      __typename: 'Language',
      projects: { __typename: 'SecuredProjectList', canRead: true },
    },
  });

  // What ProjectOverview leaves in the cache — an actual items list.
  cache.writeFragment({
    id: cache.identify(project)!,
    fragment: gql`
      fragment TestProjectEngagements on MomentumTranslationProject {
        engagements {
          total
          items {
            __typename
            id
          }
        }
      }
    `,
    data: {
      __typename: 'MomentumTranslationProject',
      engagements: {
        __typename: 'SecuredEngagementList',
        total: 1,
        items: [{ __typename: 'LanguageEngagement', id: 'eng-existing' }],
      },
    },
  });

  return cache;
};

const readLanguageProjects = (cache: InMemoryCache) =>
  cache.readFragment<{ projects: unknown }>({
    id: cache.identify(language)!,
    fragment: gql`
      fragment ReadLanguageProjects on Language {
        projects {
          canRead
        }
      }
    `,
  });

const readProjectEngagements = (cache: InMemoryCache) =>
  cache.readFragment<{
    engagements: { total: number; items: ReadonlyArray<{ id: string }> };
  }>({
    id: cache.identify(project)!,
    fragment: gql`
      fragment ReadProjectEngagements on MomentumTranslationProject {
        engagements {
          total
          items {
            id
          }
        }
      }
    `,
  });

describe('addItemToList', () => {
  // Mirrors CreateLanguageEngagement's update chain.
  const update = (cache: InMemoryCache) => {
    // Apollo writes the mutation result before running update functions,
    // so the new entity is already in the store.
    cache.writeFragment({
      id: cache.identify(newEngagement)!,
      fragment: gql`
        fragment NewEngagement on LanguageEngagement {
          id
        }
      `,
      data: { ...newEngagement },
    });
    const data = { createLanguageEngagement: { engagement: newEngagement } };
    addItemToList({
      listId: [project, 'engagements'],
      outputToItem: (res: typeof data) =>
        res.createLanguageEngagement.engagement,
    })(cache, { data }, {});
    addItemToList({
      listId: [language, 'projects'],
      outputToItem: () => project,
    })(cache, { data }, {});
  };

  it('does not crash on cached list variations that have no items', () => {
    const cache = makeCache();
    expect(() => update(cache)).not.toThrow();
  });

  it('leaves items-less list variations untouched', () => {
    const cache = makeCache();
    try {
      update(cache);
    } catch {
      // asserted separately; keep going so this failure reads clearly
    }
    expect(readLanguageProjects(cache)).toEqual({
      __typename: 'Language',
      projects: { __typename: 'SecuredProjectList', canRead: true },
    });
  });

  it('still adds the item to list variations that have items', () => {
    const cache = makeCache();
    try {
      update(cache);
    } catch {
      // asserted separately; keep going so this failure reads clearly
    }
    const engagements = readProjectEngagements(cache)!.engagements;
    expect(engagements.total).toBe(2);
    expect(engagements.items.map((i) => i.id)).toEqual(
      expect.arrayContaining(['eng-existing', 'eng-new'])
    );
  });
});

describe('removeItemFromList', () => {
  it('does not crash on cached list variations that have no items', () => {
    const cache = makeCache();
    const remove = removeItemFromList({
      listId: [language, 'projects'],
      item: project,
    });
    expect(() =>
      remove(cache, { data: { success: true } as any }, {})
    ).not.toThrow();
    expect(readLanguageProjects(cache)).toEqual({
      __typename: 'Language',
      projects: { __typename: 'SecuredProjectList', canRead: true },
    });
  });
});
