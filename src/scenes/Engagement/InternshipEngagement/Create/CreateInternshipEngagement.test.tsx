import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ProjectIdFragment } from '../../../../common/fragments';
import { UserLookupDocument } from '../../../../components/form/Lookup/User/UserLookup.graphql';
import { CreateInternshipEngagement } from './CreateInternshipEngagement';
import { CreateInternshipEngagementDocument } from './CreateInternshipEngagement.graphql';

jest.mock('../../../../components/Session', () => ({
  useSession: () => ({ powers: [] }),
}));

jest.mock('../../../Users/Create', () => ({
  CreateUser: () => null,
}));

const project = {
  __typename: 'InternshipProject',
  id: 'proj-1',
  changeset: null,
} as unknown as ProjectIdFragment;

const makePerson = (id: string, fullName: string, roles: string[]) => ({
  __typename: 'User',
  id,
  fullName,
  roles: { __typename: 'SecuredRoles', canRead: true, value: roles },
});

const internPerson = makePerson('user-intern', 'Alex Intern', ['Intern']);
const otherPerson = makePerson('user-other', 'Alex Mentor', ['Mentor']);

const newEngagement = {
  __typename: 'InternshipEngagement',
  id: 'eng-new',
  changeset: null,
  status: {
    __typename: 'SecuredEngagementStatus',
    value: 'InDevelopment',
    canRead: true,
  },
  intern: {
    __typename: 'SecuredUser',
    value: { __typename: 'User', id: 'user-intern', fullName: 'Alex Intern' },
  },
  countryOfOrigin: { __typename: 'SecuredLocation', value: null },
  position: { __typename: 'SecuredInternPosition', value: null },
  dateRange: { __typename: 'SecuredDateRange', value: null },
  initialEndDate: { __typename: 'SecuredDateNullable', value: null },
  completeDate: { __typename: 'SecuredDateNullable', value: null },
  marketable: { __typename: 'SecuredBoolean', value: false },
};

const setup = () => {
  const createResult = jest.fn(() => ({
    data: {
      createInternshipEngagement: {
        __typename: 'CreateInternshipEngagementOutput',
        engagement: newEngagement,
      },
    },
  }));
  const mocks: readonly MockedResponse[] = [
    {
      request: { query: UserLookupDocument, variables: { query: 'Alex' } },
      result: {
        data: {
          search: {
            __typename: 'SearchOutput',
            items: [internPerson, otherPerson],
          },
        },
      },
    },
    {
      request: { query: CreateInternshipEngagementDocument },
      variableMatcher: () => true,
      result: createResult,
    },
  ];
  const onClose = jest.fn();
  render(
    <MockedProvider mocks={mocks}>
      <CreateInternshipEngagement open onClose={onClose} project={project} />
    </MockedProvider>
  );
  const input = screen.getByRole('combobox');
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'Alex' } });
  return { onClose, createResult };
};

it('disables people without the Intern role', async () => {
  setup();

  const internOption = await screen.findByRole('option', {
    name: 'Alex Intern',
  });
  const otherOption = screen.getByRole('option', { name: 'Alex Mentor' });

  expect(internOption).toHaveAttribute('aria-disabled', 'false');
  expect(otherOption).toHaveAttribute('aria-disabled', 'true');
});

it('creates the engagement with a person who has the Intern role', async () => {
  const { onClose, createResult } = setup();

  fireEvent.click(await screen.findByRole('option', { name: 'Alex Intern' }));
  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(onClose).toHaveBeenCalledWith('success', expect.anything());
  });
  expect(createResult).toHaveBeenCalledWith({
    input: expect.objectContaining({
      project: 'proj-1',
      intern: 'user-intern',
    }),
  });
});
