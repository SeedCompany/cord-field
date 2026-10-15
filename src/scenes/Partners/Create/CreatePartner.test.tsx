import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { draftOrganization } from '../../../components/form/Lookup/Organization';
import { CreatePartner } from './CreatePartner';
import {
  CreatePartnerDocument,
  CreatePartnerWithOrganizationDocument,
} from './CreatePartner.graphql';

const mockMutations = new Map<unknown, jest.Mock>();

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: (doc: unknown) => [mockMutations.get(doc)],
}));

jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() }),
}));

jest.mock('../../../components/Routing', () => ({ ButtonLink: () => null }));

// Replace the real form with a button that submits the chosen organization.
let mockOrgLookup: unknown;
jest.mock('./CreatePartnerForm', () => ({
  CreatePartnerForm: ({
    onSubmit,
  }: {
    onSubmit: (values: { orgLookup: unknown }) => void;
  }) => (
    <button onClick={() => onSubmit({ orgLookup: mockOrgLookup })}>
      submit
    </button>
  ),
}));

describe('CreatePartner', () => {
  const createPartner = jest.fn();
  const createWithOrg = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutations.set(CreatePartnerDocument, createPartner);
    mockMutations.set(CreatePartnerWithOrganizationDocument, createWithOrg);
    createPartner.mockResolvedValue({
      data: { createPartner: { partner: { id: 'p1' } } },
    });
    createWithOrg.mockResolvedValue({
      data: { createPartnerWithOrganization: { partner: { id: 'p2' } } },
    });
  });

  const submit = async (orgLookup: unknown) => {
    mockOrgLookup = orgLookup;
    render(<CreatePartner open={true} />);
    await userEvent.click(screen.getByText('submit'));
  };

  it('creates the organization with the partner for a draft organization', async () => {
    await submit(draftOrganization('Acme'));

    await waitFor(() => expect(createWithOrg).toHaveBeenCalledTimes(1));
    expect(createWithOrg).toHaveBeenCalledWith({
      variables: {
        input: { organization: { name: 'Acme' }, partner: {} },
      },
    });
    expect(createPartner).not.toHaveBeenCalled();
  });

  it('links the partner to a saved organization', async () => {
    await submit({
      __typename: 'Organization',
      id: 'org-1',
      name: { __typename: 'SecuredString', value: 'Acme' },
    });

    await waitFor(() => expect(createPartner).toHaveBeenCalledTimes(1));
    expect(createPartner).toHaveBeenCalledWith({
      variables: { input: { organization: 'org-1' } },
    });
    expect(createWithOrg).not.toHaveBeenCalled();
  });
});
