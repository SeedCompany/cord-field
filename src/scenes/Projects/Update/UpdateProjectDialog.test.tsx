import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import type { ProjectOverviewFragment } from '../Overview/ProjectOverview.graphql';
import { UpdateProjectDialog } from './UpdateProjectDialog';

jest.mock('../../../components/Session', () => ({
  useSession: () => ({ powers: [] }),
}));

// Builds a minimum ProjectOverviewFragment for the marketing-region slice.
// Cast at the end is intentional: the dialog reads many fields when computing
// initialValues, and exhaustively populating ProjectOverviewFragment for every
// test would be more noise than signal. If the dialog grows new field reads,
// these tests will surface it at runtime.
const makeRegion = (id: string, name: string) => ({
  __typename: 'Location',
  id,
  name: {
    __typename: 'SecuredString',
    canRead: true,
    canEdit: false,
    value: name,
  },
});

const makeProject = (
  overrides: {
    marketingRegion?: { value: ReturnType<typeof makeRegion> | null };
    marketingRegionOverride?: {
      value: ReturnType<typeof makeRegion> | null;
      canEdit?: boolean;
    };
  } = {}
): ProjectOverviewFragment => {
  const inherited = makeRegion('mr-inherited', 'Africa Region');
  return {
    __typename: 'InternshipProject',
    id: 'project-1',
    name: { canRead: true, canEdit: true, value: 'Test Project' },
    primaryLocation: { canRead: true, canEdit: true, value: null },
    fieldRegion: { canRead: true, canEdit: true, value: null },
    mouRange: {
      canRead: true,
      canEdit: true,
      value: { start: null, end: null },
    },
    estimatedSubmission: { canRead: true, canEdit: true, value: null },
    sensitivity: 'Low',
    marketingLocation: { canRead: true, canEdit: true, value: null },
    marketingRegion: {
      canRead: true,
      value: inherited,
      ...overrides.marketingRegion,
    },
    marketingRegionOverride: {
      canRead: true,
      canEdit: true,
      value: null,
      ...overrides.marketingRegionOverride,
    },
    departmentId: { canRead: true, canEdit: true, value: null },
    usesRev79: { canRead: true, canEdit: false, value: false },
    rev79ProjectId: { canRead: true, canEdit: false, value: null },
    changeset: null,
  } as unknown as ProjectOverviewFragment;
};

const renderDialog = (project: ProjectOverviewFragment) => {
  render(
    <HelmetProvider>
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <UpdateProjectDialog
            open
            onClose={() => {
              // noop
            }}
            project={project}
            editFields={['marketingRegionOverride']}
          />
        </MemoryRouter>
      </MockedProvider>
    </HelmetProvider>
  );
};

describe('UpdateProjectDialog — marketing region override', () => {
  it('pre-fills the field with the inherited region when no override is set', async () => {
    renderDialog(makeProject());
    await waitFor(() => {
      // MUI Autocomplete renders the selected value as the input's value.
      expect(screen.getByRole('combobox')).toHaveValue('Africa Region');
    });
  });

  it('pre-fills the field with the explicit override when one is set', async () => {
    renderDialog(
      makeProject({
        marketingRegionOverride: {
          value: makeRegion('mr-override', 'Custom Region'),
          canEdit: true,
        },
      })
    );
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('Custom Region');
    });
  });

  it('leaves the field empty when there is neither an override nor an inherited region', async () => {
    renderDialog(makeProject({ marketingRegion: { value: null } }));
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });
});
