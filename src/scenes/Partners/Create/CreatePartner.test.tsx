import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { SnackbarProvider } from 'notistack';
import { MemoryRouter } from 'react-router-dom';
import { CreatePartner } from './CreatePartner';
import {
  CreatePartnerWithOrganizationDocument,
  CreatePartnerWithOrganizationMutation,
} from './CreatePartner.graphql';
import { PartnerFormValues } from './CreatePartnerForm';

jest.mock('~/components/Session', () => ({
  useSession: () => ({ powers: [] }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CreatedPartner =
  CreatePartnerWithOrganizationMutation['createPartnerWithOrganization']['partner'];

const makePartner = (name: string): CreatedPartner => ({
  __typename: 'Partner',
  id: 'partner-1',
  pinned: false,
  organization: {
    __typename: 'SecuredOrganization',
    canRead: true,
    canEdit: true,
    value: {
      __typename: 'Organization',
      id: 'org-1',
      name: {
        __typename: 'SecuredString',
        canRead: true,
        canEdit: true,
        value: name,
      },
      acronym: {
        __typename: 'SecuredStringNullable',
        canRead: true,
        canEdit: true,
        value: null,
      },
    },
  },
  types: { __typename: 'SecuredPartnerTypes', value: [] },
  financialReportingTypes: {
    __typename: 'SecuredFinancialReportingTypes',
    value: [],
  },
});

const createWithOrganizationMock = (
  name: string,
  result: MockedResponse['result']
): MockedResponse => ({
  request: {
    query: CreatePartnerWithOrganizationDocument,
    variables: { input: { organization: { name }, partner: {} } },
  },
  result,
});

// Opens the dialog the way the partner lookup's "Create" option does
const renderPrefilled = (name: string, mocks: readonly MockedResponse[]) => {
  const initialValues: Partial<PartnerFormValues> = {
    organization: { name },
  };
  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <SnackbarProvider>
          <CreatePartner open initialValues={initialValues} sendIfClean />
        </SnackbarProvider>
      </MemoryRouter>
    </MockedProvider>
  );
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CreatePartner', () => {
  it('creates the partner and its new organization from the prefilled name', async () => {
    const partner = makePartner('Acme');
    const result = jest.fn(() => ({
      data: { createPartnerWithOrganization: { partner } },
    }));
    renderPrefilled('Acme', [createWithOrganizationMock('Acme', result)]);

    expect(screen.getByLabelText(/Organization Name/)).toHaveValue('Acme');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Created partner: Acme')
    ).toBeInTheDocument();
    expect(result).toHaveBeenCalledTimes(1);
  });

  it('shows a taken organization name on the name field', async () => {
    renderPrefilled('Acme', [
      createWithOrganizationMock('Acme', {
        errors: [
          new GraphQLError('Organization with this name already exists', {
            extensions: { codes: ['Duplicate', 'Input'], field: 'name' },
          }),
        ],
      }),
    ]);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Already in use')).toBeInTheDocument();
  });
});
