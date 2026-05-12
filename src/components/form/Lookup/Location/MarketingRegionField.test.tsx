import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { MarketingRegionField } from './MarketingRegionField';
import {
  MarketingRegionLookupDocument,
  type MarketingRegionLookupQuery,
} from './MarketingRegionLookup.graphql';

jest.mock('../../../Session', () => ({
  useSession: () => ({ powers: [] }),
}));

type LookupItem = MarketingRegionLookupQuery['search']['items'][number];

const makeLocation = (overrides?: Partial<LookupItem>): LookupItem => ({
  __typename: 'Location',
  id: 'region-1',
  name: {
    __typename: 'SecuredString',
    canRead: true,
    canEdit: false,
    value: 'Africa Region',
  },
  type: {
    __typename: 'SecuredLocationType',
    canRead: true,
    value: 'Region',
  },
  ...overrides,
});

const searchMock = (
  query: string,
  items: readonly LookupItem[] = [makeLocation()]
): MockedResponse => ({
  request: { query: MarketingRegionLookupDocument, variables: { query } },
  result: {
    data: {
      search: {
        __typename: 'LocationListOutput',
        items,
      },
    },
  },
});

const setup = (mocks: readonly MockedResponse[] = []) => {
  render(
    <MockedProvider mocks={mocks}>
      <Form
        initialValues={{}}
        onSubmit={() => {
          // noop
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <MarketingRegionField
              name="marketingRegion"
              label="Marketing Region"
            />
          </form>
        )}
      </Form>
    </MockedProvider>
  );

  return screen.getByRole('combobox');
};

const setupWithInitialValues = (
  initialValues: Record<string, unknown>,
  mocks: readonly MockedResponse[] = []
) => {
  render(
    <MockedProvider mocks={mocks}>
      <Form
        initialValues={initialValues}
        onSubmit={() => {
          // noop
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <MarketingRegionField
              name="marketingRegion"
              label="Marketing Region"
            />
          </form>
        )}
      </Form>
    </MockedProvider>
  );

  return screen.getByRole('combobox');
};

const search = (input: HTMLElement, query: string) => {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: query } });
};

describe('MarketingRegionField', () => {
  it('renders the input', () => {
    const input = setup();
    expect(input).toBeInTheDocument();
  });

  it('filters out non-region lookup items', async () => {
    const items = [
      makeLocation(),
      makeLocation({
        id: 'country-1',
        name: {
          __typename: 'SecuredString',
          canRead: true,
          canEdit: false,
          value: 'Canada',
        },
        type: {
          __typename: 'SecuredLocationType',
          canRead: true,
          value: 'Country',
        },
      }),
    ];

    const input = setup([searchMock('a', items)]);
    search(input, 'a');

    await waitFor(() => {
      expect(screen.getByText('Africa Region')).toBeInTheDocument();
      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
    });
  });

  it('keeps an already-selected non-region value visible', async () => {
    const selectedCountry = makeLocation({
      id: 'country-2',
      name: {
        __typename: 'SecuredString',
        canRead: true,
        canEdit: false,
        value: 'Canada',
      },
      type: {
        __typename: 'SecuredLocationType',
        canRead: true,
        value: 'Country',
      },
    });

    const input = setupWithInitialValues({ marketingRegion: selectedCountry }, [
      searchMock('Ca', [makeLocation()]),
    ]);

    // Starts with the selected value from form state.
    expect(input).toHaveValue('Canada');

    search(input, 'Ca');

    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });
  });
});
