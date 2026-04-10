import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { LanguageField } from './LanguageField';
import { LanguageLookupDocument } from './LanguageLookup.graphql';

jest.mock('../../../Session', () => ({
  useSession: () => ({ powers: [] }),
}));

jest.mock('../../../../scenes/Languages/Create', () => ({
  CreateLanguage: () => null,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeLang = (overrides?: object) => ({
  __typename: 'Language',
  id: 'lang-1',
  publicName: 'English',
  ethnologue: {
    __typename: 'EthnologueLanguage',
    code: { __typename: 'SecuredStringNullable', value: 'eng' },
  },
  registryOfLanguageVarietiesCode: {
    __typename: 'SecuredStringNullable',
    value: 'lv12345',
  },
  ...overrides,
});

const searchMock = (query: string, items = [makeLang()]): MockedResponse => ({
  request: { query: LanguageLookupDocument, variables: { query } },
  result: { data: { search: { __typename: 'SearchOutput', items } } },
});

const setup = (mocks: readonly MockedResponse[] = []) => {
  render(
    <MockedProvider mocks={mocks}>
      <Form
        onSubmit={() => {
          // noop
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <LanguageField name="language" label="Language" />
          </form>
        )}
      </Form>
    </MockedProvider>
  );
  return screen.getByRole('combobox');
};

// Focuses the input and changes its value in one shot, triggering a single
// Apollo query rather than one per character (as userEvent.type would do).
const search = (input: HTMLElement, query: string) => {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: query } });
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('LanguageField', () => {
  it('renders the input', () => {
    const input = setup();
    expect(input).toBeInTheDocument();
  });

  describe('column headers', () => {
    it('shows ETH and ROLV headers when the dropdown opens', async () => {
      const input = setup([searchMock('Engl')]);
      search(input, 'Engl');

      await waitFor(() => {
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('ROLV')).toBeInTheDocument();
      });
    });
  });

  describe('option rows', () => {
    it('shows the language name', async () => {
      const input = setup([searchMock('Engl')]);
      search(input, 'Engl');

      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
      });
    });

    it('shows the ETH code', async () => {
      const input = setup([searchMock('Engl')]);
      search(input, 'Engl');

      await waitFor(() => {
        expect(screen.getByText('eng')).toBeInTheDocument();
      });
    });

    it('shows the ROLV code', async () => {
      const input = setup([searchMock('Engl')]);
      search(input, 'Engl');

      await waitFor(() => {
        expect(screen.getByText('lv12345')).toBeInTheDocument();
      });
    });

    it('shows all results with their respective codes', async () => {
      // Both names contain 'Engl' so MUI's client-side filter passes them through
      const langs = [
        makeLang(),
        makeLang({
          id: 'lang-2',
          publicName: 'English Creole',
          ethnologue: {
            __typename: 'EthnologueLanguage',
            code: { __typename: 'SecuredStringNullable', value: 'cpe' },
          },
          registryOfLanguageVarietiesCode: {
            __typename: 'SecuredStringNullable',
            value: 'lv99999',
          },
        }),
      ];
      const input = setup([searchMock('Engl', langs)]);
      search(input, 'Engl');

      await waitFor(() => {
        expect(screen.getByText('eng')).toBeInTheDocument();
        expect(screen.getByText('lv12345')).toBeInTheDocument();
        expect(screen.getByText('cpe')).toBeInTheDocument();
        expect(screen.getByText('lv99999')).toBeInTheDocument();
      });
    });
  });
});
