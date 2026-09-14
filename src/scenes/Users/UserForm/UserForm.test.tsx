import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { UserStatus } from '~/api/schema.graphql';
import { SnackbarProvider } from '~/components/Snackbar';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { CreateUser } from '../Create';
import { EditUser } from '../Edit';
import type { UserFormFragment } from './UserForm.graphql';

jest.mock('../../../components/Session', () => ({
  useSession: () => ({ session: undefined }),
}));

const secured = <T,>(value: T) => ({ canRead: true, canEdit: true, value });

// Builds a minimum UserFormFragment for the status slice. Cast at the end is
// intentional: EditUser reads many fields when computing initialValues, and
// exhaustively populating UserFormFragment for every test would be more noise
// than signal.
const makeUser = (status: UserStatus): UserFormFragment =>
  ({
    __typename: 'User',
    id: 'user-1',
    realFirstName: secured('Real'),
    realLastName: secured('Person'),
    displayFirstName: secured('Display'),
    displayLastName: secured('Person'),
    gender: secured(null),
    status: secured(status),
    email: secured(null),
    title: secured(null),
    phone: secured(null),
    timezone: secured(null),
    about: secured(null),
    roles: { ...secured([]), assignableRoles: [] },
  } as unknown as UserFormFragment);

const renderInProviders = (ui: React.ReactElement) => {
  render(
    <HelmetProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <MockedProvider mocks={[]}>
            <MemoryRouter>{ui}</MemoryRouter>
          </MockedProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

const statusRadio = (label: string) =>
  within(screen.getByRole('group', { name: 'Status' })).getByRole('radio', {
    name: label,
  });

const noop = () => {
  // noop
};

describe('UserForm — status default', () => {
  it('defaults to Disabled when creating a person', async () => {
    renderInProviders(<CreateUser open onClose={noop} />);

    await waitFor(() => {
      expect(statusRadio('Disabled')).toBeChecked();
    });
    expect(statusRadio('Active')).not.toBeChecked();
  });

  it('keeps the existing status when editing a person', async () => {
    renderInProviders(
      <EditUser open onClose={noop} user={makeUser('Active')} />
    );

    await waitFor(() => {
      expect(statusRadio('Active')).toBeChecked();
    });
    expect(statusRadio('Disabled')).not.toBeChecked();
  });
});
