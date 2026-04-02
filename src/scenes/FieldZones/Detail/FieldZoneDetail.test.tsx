import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FieldZoneDetail } from './FieldZoneDetail';
import { FieldZoneDetailDocument } from './FieldZoneDetail.graphql';

jest.mock('./Tabs/Projects/FieldZoneProjectsPanel', () => ({
  FieldZoneProjectsPanel: () => <div data-testid="projects-panel" />,
}));

jest.mock('~/components/FieldZone', () => ({
  EditFieldZone: () => null,
}));

jest.mock('~/components/Error', () => ({
  Error: () => null,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeFieldZone = (overrides = {}) => ({
  __typename: 'FieldZone',
  id: 'zone-1',
  name: {
    __typename: 'SecuredString',
    value: 'Asia Pacific',
    canRead: true,
    canEdit: false,
  },
  director: {
    __typename: 'SecuredUser',
    canRead: true,
    canEdit: false,
    value: null,
  },
  projects: { canRead: true },
  ...overrides,
});

const makeDetailMock = (fieldZone = makeFieldZone()): MockedResponse => ({
  request: {
    query: FieldZoneDetailDocument,
    variables: { fieldZoneId: 'zone-1' },
  },
  result: { data: { fieldZone } },
});

const renderDetail = (
  mocks: readonly MockedResponse[] = [makeDetailMock()]
) => {
  render(
    <HelmetProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/field-zones/zone-1']}>
          <Routes>
            <Route
              path="/field-zones/:fieldZoneId"
              element={<FieldZoneDetail />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </HelmetProvider>
  );
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('FieldZoneDetail', () => {
  it('renders the zone name', async () => {
    renderDetail();
    await waitFor(() => {
      expect(screen.getByText('Asia Pacific')).toBeInTheDocument();
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
        makeDetailMock(makeFieldZone({ projects: { canRead: false } })),
      ]);
      await waitFor(() => {
        // Both assertions together so waitFor retries until the query has
        // resolved and canReadProjects has updated to false.
        expect(screen.getByText('Asia Pacific')).toBeInTheDocument();
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
          makeFieldZone({
            name: {
              __typename: 'SecuredString',
              value: 'Asia Pacific',
              canRead: true,
              canEdit: true,
            },
          })
        ),
      ]);
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /edit zone/i })
        ).toBeInTheDocument();
      });
    });

    it('hides when user lacks edit permission on all fields', async () => {
      renderDetail();
      await waitFor(() => {
        expect(screen.getByText('Asia Pacific')).toBeInTheDocument();
      });
      expect(
        screen.queryByRole('button', { name: /edit zone/i })
      ).not.toBeInTheDocument();
    });
  });
});
