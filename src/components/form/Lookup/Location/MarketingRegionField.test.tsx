import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { InitialMarketingRegionOptionsDocument } from './InitialMarketingRegionOptions.graphql';
import { MarketingRegionField } from './MarketingRegionField';
import { MarketingRegionLookupDocument } from './MarketingRegionLookup.graphql';

jest.mock('../../../Session', () => ({
  useSession: () => ({ powers: [] }),
}));

const makeRegion = (overrides?: object) => ({
  __typename: 'Location',
  id: 'region-1',
  name: {
    __typename: 'SecuredString',
    canRead: true,
    canEdit: false,
    value: 'Africa Region',
  },
  ...overrides,
});

const searchMock = (query: string, items = [makeRegion()]): MockedResponse => ({
  request: { query: MarketingRegionLookupDocument, variables: { query } },
  result: {
    data: { search: { __typename: 'LocationListOutput', items } },
  },
});

// The field queries this on mount to prepopulate the dropdown, so every
// render needs it mocked regardless of what the test is asserting.
const initialMock = (items = [makeRegion()]): MockedResponse => ({
  request: { query: InitialMarketingRegionOptionsDocument },
  result: {
    data: { locations: { __typename: 'LocationListOutput', items } },
  },
});

const setup = (
  mocks: readonly MockedResponse[] = [initialMock()],
  initialValues?: object
) => {
  render(
    <MockedProvider mocks={mocks}>
      <Form
        onSubmit={() => {
          // noop
        }}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <MarketingRegionField name="marketingRegion" />
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

describe('MarketingRegionField', () => {
  it('renders with the default "Marketing Region" label', () => {
    setup();
    expect(screen.getByLabelText('Marketing Region')).toBeInTheDocument();
  });

  it('prepopulates the dropdown on focus, without typing', async () => {
    const input = setup([
      initialMock([
        makeRegion(),
        makeRegion({
          id: 'region-2',
          name: {
            __typename: 'SecuredString',
            canRead: true,
            canEdit: false,
            value: 'Asia Region',
          },
        }),
      ]),
    ]);
    fireEvent.focus(input);
    await waitFor(() => {
      expect(screen.getByText('Africa Region')).toBeInTheDocument();
      expect(screen.getByText('Asia Region')).toBeInTheDocument();
    });
  });

  // The complaint from the field: a location/region field that already has a
  // value shows nothing on focus, because `input` starts equal to the
  // selected item's label and the popup only opened for an empty or
  // changed input.
  it('prepopulates on focus even when a value is already selected', async () => {
    const selected = makeRegion();
    const input = setup(
      [
        initialMock([
          selected,
          makeRegion({
            id: 'region-2',
            name: {
              __typename: 'SecuredString',
              canRead: true,
              canEdit: false,
              value: 'Asia Region',
            },
          }),
        ]),
      ],
      { marketingRegion: selected }
    );
    fireEvent.focus(input);
    await waitFor(() => {
      expect(screen.getByText('Asia Region')).toBeInTheDocument();
    });
  });

  it('shows search results in the dropdown', async () => {
    const input = setup([initialMock(), searchMock('Afri')]);
    search(input, 'Afri');
    await waitFor(() => {
      expect(screen.getByText('Africa Region')).toBeInTheDocument();
    });
  });

  it('shows multiple results when the API returns them', async () => {
    const input = setup([
      initialMock(),
      searchMock('Reg', [
        makeRegion(),
        makeRegion({
          id: 'region-2',
          name: {
            __typename: 'SecuredString',
            canRead: true,
            canEdit: false,
            value: 'Asia Region',
          },
        }),
      ]),
    ]);
    search(input, 'Reg');
    await waitFor(() => {
      expect(screen.getByText('Africa Region')).toBeInTheDocument();
      expect(screen.getByText('Asia Region')).toBeInTheDocument();
    });
  });
});
