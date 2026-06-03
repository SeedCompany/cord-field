import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocationDetail } from './LocationDetail';
import { LocationDocument, type LocationQuery } from './LocationDetail.graphql';

jest.mock('../Edit', () => ({
  EditLocation: () => null,
}));

jest.mock('../../../components/Error', () => ({
  Error: () => null,
}));

type Loc = LocationQuery['location'];

const makeLocation = (overrides: Partial<Loc> = {}): Loc => {
  const location: Loc = {
    __typename: 'Location',
    id: 'loc-1',
    createdAt:
      '2026-01-01T00:00:00.000Z' as LocationQuery['location']['createdAt'],
    name: {
      __typename: 'SecuredString',
      canRead: true,
      canEdit: false,
      value: 'Kenya',
    },
    isoAlpha3: {
      __typename: 'SecuredStringNullable',
      canRead: true,
      canEdit: false,
      value: 'KEN',
    },
    type: {
      __typename: 'SecuredLocationType',
      canRead: true,
      canEdit: false,
      value: 'Country',
    },
    fundingAccount: {
      __typename: 'SecuredFundingAccount',
      canRead: true,
      canEdit: false,
      value: null,
    },
    defaultFieldRegion: {
      __typename: 'SecuredFieldRegion',
      canRead: true,
      canEdit: false,
      value: null,
    },
    defaultMarketingRegion: {
      __typename: 'SecuredLocation',
      canRead: true,
      canEdit: false,
      value: {
        __typename: 'Location',
        id: 'mr-1',
        name: {
          __typename: 'SecuredString',
          canRead: true,
          canEdit: false,
          value: 'Africa Region',
        },
      },
    },
    mapImage: {
      __typename: 'SecuredFile',
      canRead: true,
      canEdit: false,
      value: null,
    },
    ...overrides,
  };
  return location;
};

const makeMock = (
  location: Loc = makeLocation()
): MockedResponse<LocationQuery> => ({
  request: { query: LocationDocument, variables: { locationId: 'loc-1' } },
  result: { data: { location } },
});

const renderDetail = (mocks: readonly MockedResponse[] = [makeMock()]) => {
  render(
    <HelmetProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/locations/loc-1']}>
          <Routes>
            <Route path="/locations/:locationId" element={<LocationDetail />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </HelmetProvider>
  );
};

describe('LocationDetail — default marketing region', () => {
  it('renders the region as a link to its location page', async () => {
    renderDetail();
    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'Africa Region' });
      expect(link).toHaveAttribute('href', '/locations/mr-1');
    });
  });

  it('renders "None" when the field is readable but unset', async () => {
    renderDetail([
      makeMock(
        makeLocation({
          defaultMarketingRegion: {
            __typename: 'SecuredLocation',
            canRead: true,
            canEdit: false,
            value: null,
          },
        })
      ),
    ]);
    await waitFor(() => {
      // Label span includes a trailing colon, so match by regex and scope
      // the value assertion to the property row.
      expect(
        screen.getByText(/Marketing Region/).parentElement
      ).toHaveTextContent('None');
    });
  });

  it('renders a redacted placeholder when the user cannot read the field', async () => {
    renderDetail([
      makeMock(
        makeLocation({
          defaultMarketingRegion: {
            __typename: 'SecuredLocation',
            canRead: false,
            canEdit: false,
            value: null,
          },
        })
      ),
    ]);
    await waitFor(() => {
      expect(
        screen.getByLabelText(
          "You don't have permission to view the default marketing region"
        )
      ).toBeInTheDocument();
    });
  });
});
