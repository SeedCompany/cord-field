import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FieldRegionDetail } from './FieldRegionDetail';
import { FieldRegionDetailDocument } from './FieldRegionDetail.graphql';

jest.mock('./Tabs/Projects/FieldRegionProjectsPanel', () => ({
  FieldRegionProjectsPanel: () => <div data-testid="projects-panel" />,
}));

jest.mock('~/components/FieldRegion', () => ({
  EditFieldRegion: () => null,
}));

jest.mock('~/components/Error', () => ({
  Error: () => null,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeFieldRegion = (overrides = {}) => ({
  __typename: 'FieldRegion',
  id: 'region-1',
  name: {
    __typename: 'SecuredString',
    value: 'East Asia',
    canRead: true,
    canEdit: false,
  },
  director: {
    __typename: 'SecuredUser',
    canRead: true,
    canEdit: false,
    value: null,
  },
  fieldZone: {
    __typename: 'SecuredFieldZone',
    canRead: true,
    canEdit: false,
    value: null,
  },
  projects: { canRead: true },
  ...overrides,
});

const makeDetailMock = (fieldRegion = makeFieldRegion()): MockedResponse => ({
  request: {
    query: FieldRegionDetailDocument,
    variables: { fieldRegionId: 'region-1' },
  },
  result: { data: { fieldRegion } },
});

const renderDetail = (
  mocks: readonly MockedResponse[] = [makeDetailMock()]
) => {
  render(
    <HelmetProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/field-regions/region-1']}>
          <Routes>
            <Route
              path="/field-regions/:fieldRegionId"
              element={<FieldRegionDetail />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </HelmetProvider>
  );
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('FieldRegionDetail', () => {
  it('renders the region name', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('East Asia')).toBeInTheDocument();
    });
  });

  describe('tabs', () => {
    it('always shows the Profile tab', async () => {
      renderDetail();
      await waitFor(() => {
        expect(
          screen.getByRole('tab', { name: 'Profile' })
        ).toBeInTheDocument();
      });
    });

    it('shows Projects tab when projects.canRead is true', async () => {
      renderDetail();
      await waitFor(() => {
        expect(
          screen.getByRole('tab', { name: 'Projects' })
        ).toBeInTheDocument();
      });
    });

    it('hides Projects tab when projects.canRead is false', async () => {
      renderDetail([
        makeDetailMock(makeFieldRegion({ projects: { canRead: false } })),
      ]);
      await waitFor(() => {
        // Both assertions together so waitFor retries until the query has
        // resolved and canReadProjects has updated to false.
        expect(screen.getByText('East Asia')).toBeInTheDocument();
        expect(
          screen.queryByRole('tab', { name: 'Projects' })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('edit button', () => {
    it('shows when user has edit permission on any field', async () => {
      renderDetail([
        makeDetailMock(
          makeFieldRegion({
            name: {
              __typename: 'SecuredString',
              value: 'East Asia',
              canRead: true,
              canEdit: true,
            },
          })
        ),
      ]);
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /edit region/i })
        ).toBeInTheDocument();
      });
    });

    it('hides when user lacks edit permission on all fields', async () => {
      renderDetail();
      await waitFor(() => {
        expect(screen.getByText('East Asia')).toBeInTheDocument();
      });
      expect(
        screen.queryByRole('button', { name: /edit region/i })
      ).not.toBeInTheDocument();
    });
  });
});
