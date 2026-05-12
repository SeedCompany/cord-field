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

const makeLocation = (
  overrides: Partial<LocationQuery['location']> = {}
): LocationQuery['location'] => ({
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
    value: {
      __typename: 'FieldRegion',
      id: 'fr-1',
      name: {
        __typename: 'SecuredString',
        value: 'East Africa Field Region (Africa Field Zone)',
      },
    },
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
        value: 'Africa Marketing Region',
      },
      type: {
        __typename: 'SecuredLocationType',
        canRead: true,
        value: 'Region',
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
});

const makeLocationMock = (
  location: LocationQuery['location'] = makeLocation()
): MockedResponse<LocationQuery> => ({
  request: {
    query: LocationDocument,
    variables: { locationId: 'loc-1' },
  },
  result: { data: { location } },
});

const renderDetail = (
  mocks: readonly MockedResponse[] = [makeLocationMock()]
) => {
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

describe('LocationDetail', () => {
  it('shows the type value as Marketing Region for region locations', async () => {
    renderDetail([
      makeLocationMock(
        makeLocation({
          name: {
            __typename: 'SecuredString',
            canRead: true,
            canEdit: false,
            value: 'Africa Region',
          },
          type: {
            __typename: 'SecuredLocationType',
            canRead: true,
            canEdit: false,
            value: 'Region',
          },
        })
      ),
    ]);

    await waitFor(() => {
      expect(screen.getByText('Marketing Region')).toBeInTheDocument();
    });
  });

  it('shows Country type label for country locations', async () => {
    renderDetail();

    await waitFor(() => {
      expect(screen.getByText('Country')).toBeInTheDocument();
    });
  });

  it('renders links for default field region and default marketing region', async () => {
    renderDetail();

    await waitFor(() => {
      expect(
        screen.getByRole('link', {
          name: 'East Africa Field Region (Africa Field Zone)',
        })
      ).toHaveAttribute('href', '/field-regions/fr-1');

      expect(
        screen.getByRole('link', { name: 'Africa Marketing Region' })
      ).toHaveAttribute('href', '/locations/mr-1');
    });
  });

  it('shows None when default regions are unset and readable', async () => {
    renderDetail([
      makeLocationMock(
        makeLocation({
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
            value: null,
          },
        })
      ),
    ]);

    await waitFor(() => {
      expect(screen.getAllByText('None')).toHaveLength(2);
    });
  });
});
