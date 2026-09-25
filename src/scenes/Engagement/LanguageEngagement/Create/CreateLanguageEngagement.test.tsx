import {
  gql,
  InMemoryCache,
  PossibleTypesMap,
  TypePolicies,
} from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { possibleTypes } from '../../../../api/schema/fragmentMatcher';
import { typePolicies } from '../../../../api/schema/typePolicies';
import type { ProjectIdFragment } from '../../../../common/fragments';
import { LanguageLookupDocument } from '../../../../components/form/Lookup/Language/LanguageLookup.graphql';
import { CreateLanguageEngagement } from './CreateLanguageEngagement';
import { CreateLanguageEngagementDocument } from './CreateLanguageEngagement.graphql';

jest.mock('../../../../components/Session', () => ({
  useSession: () => ({ powers: [] }),
}));

jest.mock('../../../Languages/Create', () => ({
  CreateLanguage: () => null,
}));

// Regression test for the Create Engagement dialog hanging after submit with
// "Cannot read properties of undefined (reading 'some')". Visiting a language
// detail page caches `Language.projects` with only `canRead` (no items), which
// the mutation's addItemToList update then choked on — after the engagement was
// already created server-side.

const project = {
  __typename: 'MomentumTranslationProject',
  id: 'proj-1',
  changeset: null,
} as unknown as ProjectIdFragment;

const language = {
  __typename: 'Language',
  id: 'lang-1',
  displayName: { __typename: 'SecuredString', value: 'English' },
  ethnologue: {
    __typename: 'EthnologueLanguage',
    code: { __typename: 'SecuredStringNullable', value: 'eng' },
  },
  registryOfLanguageVarietiesCode: {
    __typename: 'SecuredStringNullable',
    value: 'lv12345',
  },
};

const newEngagement = {
  __typename: 'LanguageEngagement',
  id: 'eng-new',
  changeset: null,
  status: {
    __typename: 'SecuredEngagementStatus',
    value: 'InDevelopment',
    canRead: true,
  },
  language: { __typename: 'SecuredLanguage', value: null },
  products: { __typename: 'SecuredProductList', total: 0 },
};

const mocks: readonly MockedResponse[] = [
  {
    request: {
      query: LanguageLookupDocument,
      variables: { query: 'Engl' },
    },
    result: {
      data: {
        search: { __typename: 'SearchOutput', items: [language] },
      },
    },
  },
  {
    request: { query: CreateLanguageEngagementDocument },
    variableMatcher: () => true,
    result: {
      data: {
        createLanguageEngagement: {
          __typename: 'CreateLanguageEngagementOutput',
          engagement: newEngagement,
        },
      },
    },
  },
];

const makeCache = () => {
  // @ts-expect-error same as createCache — the generated `as const` readonly
  // arrays need to be widened to arrays of any strings.
  const pt: PossibleTypesMap = possibleTypes;
  const cache = new InMemoryCache({
    possibleTypes: pt,
    typePolicies: typePolicies as TypePolicies,
  });
  // What visiting the language's detail page leaves in the cache:
  // a projects list with perms only — no items.
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
  return cache;
};

const setup = (cache: InMemoryCache) => {
  const onClose = jest.fn();
  render(
    <MockedProvider mocks={mocks} cache={cache}>
      <CreateLanguageEngagement open onClose={onClose} project={project} />
    </MockedProvider>
  );
  return onClose;
};

it('creates the engagement and closes, even when the cached language has an items-less projects list', async () => {
  const cache = makeCache();
  const onClose = setup(cache);

  const input = screen.getByRole('combobox');
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'Engl' } });

  fireEvent.click(await screen.findByText('English'));

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledWith('success', expect.anything());
  });

  // The items-less list is untouched rather than crashed on.
  expect(
    cache.readFragment({
      id: cache.identify(language)!,
      fragment: gql`
        fragment ReadLanguageProjects on Language {
          projects {
            canRead
          }
        }
      `,
    })
  ).toEqual({
    __typename: 'Language',
    projects: { __typename: 'SecuredProjectList', canRead: true },
  });
});
