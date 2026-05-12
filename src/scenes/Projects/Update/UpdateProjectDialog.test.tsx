import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import type { ProjectOverviewFragment } from '../Overview/ProjectOverview.graphql';
import { UpdateProjectDialog } from './UpdateProjectDialog';

const mockUpdateProject = jest.fn();
const mockDialogFormSpy = jest.fn();

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: () => [mockUpdateProject],
}));

jest.mock('../../../components/Dialog/DialogForm', () => ({
  DialogForm: ({ children, ...props }: any) => {
    mockDialogFormSpy(props);
    return <form>{children}</form>;
  },
}));

jest.mock('../../../components/form', () => ({
  CheckboxField: () => null,
  DateField: () => null,
  EnumField: () => null,
  SecuredField: ({ name, children }: any) => <>{children({ name })}</>,
  SubmitError: () => null,
  TextField: () => null,
}));

jest.mock('../../../components/form/Lookup', () => ({
  LocationField: ({ label, name }: any) => (
    <div data-testid={`location-field-${name}`}>{label}</div>
  ),
  MarketingRegionField: ({ label, name }: any) => (
    <div data-testid={`marketing-region-field-${name}`}>{label}</div>
  ),
}));

jest.mock('../../../components/form/Lookup/FieldRegion', () => ({
  FieldRegionField: ({ label, name }: any) => (
    <div data-testid={`field-region-field-${name}`}>{label}</div>
  ),
}));

jest.mock('../DateRangeCache', () => ({
  updateEngagementDateRanges: jest.fn(),
  updatePartnershipsDateRanges: jest.fn(),
}));

const makeProject = (): ProjectOverviewFragment =>
  ({
    __typename: 'InternshipProject',
    id: 'project-1',
    name: { canRead: true, canEdit: true, value: 'Test Project' },
    primaryLocation: {
      canRead: true,
      canEdit: true,
      value: {
        id: 'loc-1',
        name: { canRead: true, canEdit: false, value: 'Kenya' },
      },
    },
    marketingLocation: {
      canRead: true,
      canEdit: true,
      value: {
        id: 'loc-2',
        name: { canRead: true, canEdit: false, value: 'Nairobi' },
        defaultMarketingRegion: {
          canRead: true,
          value: {
            id: 'mr-1',
            name: { canRead: true, canEdit: false, value: 'Africa Region' },
            type: { canRead: true, value: 'Region' },
          },
        },
      },
    },
    marketingRegionOverride: {
      canRead: true,
      canEdit: true,
      value: null,
    },
    fieldRegion: {
      canRead: true,
      canEdit: true,
      value: {
        id: 'fr-1',
        name: { value: 'East Africa Field Region' },
      },
    },
    mouRange: {
      canRead: true,
      canEdit: true,
      value: { start: null, end: null },
    },
    estimatedSubmission: { canRead: true, canEdit: true, value: null },
    sensitivity: 'Low',
    departmentId: { canRead: true, canEdit: true, value: null },
    usesRev79: { canRead: true, canEdit: false, value: false },
    rev79ProjectId: { canRead: true, canEdit: false, value: null },
    budget: { value: null },
    changeset: null,
  } as unknown as ProjectOverviewFragment);

const renderDialog = (
  props: Partial<ComponentProps<typeof UpdateProjectDialog>> = {}
) => {
  const project = props.project ?? makeProject();
  const dialogProps: ComponentProps<typeof UpdateProjectDialog> = {
    open: true,
    onClose: jest.fn(),
    project,
    editFields: [
      'primaryLocation',
      'marketingLocation',
      'fieldRegion',
      'marketingRegionOverride',
    ],
    ...props,
  };

  render(<UpdateProjectDialog {...dialogProps} />);
};

describe('UpdateProjectDialog project location fields', () => {
  beforeEach(() => {
    mockDialogFormSpy.mockClear();
    mockUpdateProject.mockReset();
    mockUpdateProject.mockResolvedValue({ data: {} });
  });

  it('renders primary location, marketing location, field region, and marketing region fields', () => {
    renderDialog();

    expect(
      screen.getByTestId('location-field-primaryLocation')
    ).toHaveTextContent('Primary Location');
    expect(
      screen.getByTestId('location-field-marketingLocation')
    ).toHaveTextContent('Marketing Location');
    expect(
      screen.getByTestId('field-region-field-fieldRegion')
    ).toHaveTextContent('Field Region');
    expect(
      screen.getByTestId('marketing-region-field-marketingRegionOverride')
    ).toHaveTextContent('Marketing Region');
  });

  it('prepopulates marketing region from marketing location default when no override exists', () => {
    renderDialog({ editFields: ['marketingRegionOverride'] });

    const latestProps = mockDialogFormSpy.mock.calls.at(-1)?.[0];
    expect(latestProps?.initialValues.marketingRegionOverride).toMatchObject({
      id: 'mr-1',
    });
  });

  it('maps dirty location and field-region values to ids on submit', async () => {
    renderDialog();

    const latestProps = mockDialogFormSpy.mock.calls.at(-1)?.[0];
    expect(latestProps?.onSubmit).toBeDefined();

    await latestProps.onSubmit(
      {
        id: 'project-1',
        primaryLocation: {
          id: 'loc-10',
          name: { canRead: true, canEdit: false, value: 'Kenya' },
        },
        marketingLocation: {
          id: 'loc-20',
          name: { canRead: true, canEdit: false, value: 'Nairobi' },
          defaultMarketingRegion: {
            canRead: true,
            value: {
              id: 'mr-20',
              name: { canRead: true, canEdit: false, value: 'Africa Region' },
              type: { canRead: true, value: 'Region' },
            },
          },
        },
        marketingRegionOverride: {
          id: 'mr-20',
          name: { canRead: true, canEdit: false, value: 'Africa Region' },
          type: { canRead: true, value: 'Region' },
        },
        fieldRegion: {
          id: 'fr-20',
          name: { value: 'East Africa Field Region' },
        },
      },
      {
        getState: () => ({
          dirtyFields: {
            primaryLocation: true,
            marketingLocation: true,
            fieldRegion: true,
            marketingRegionOverride: true,
          },
        }),
      }
    );

    expect(mockUpdateProject).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            primaryLocation: 'loc-10',
            marketingLocation: 'loc-20',
            fieldRegion: 'fr-20',
            marketingRegionOverride: 'mr-20',
          }),
        },
      })
    );
  });

  it('maps marketing region from marketing location default when location changed and override not edited', async () => {
    renderDialog({ editFields: ['marketingLocation'] });

    const latestProps = mockDialogFormSpy.mock.calls.at(-1)?.[0];
    expect(latestProps?.onSubmit).toBeDefined();

    await latestProps.onSubmit(
      {
        id: 'project-1',
        marketingLocation: {
          id: 'loc-30',
          name: { canRead: true, canEdit: false, value: 'Nairobi' },
          defaultMarketingRegion: {
            canRead: true,
            value: {
              id: 'mr-30',
              name: { canRead: true, canEdit: false, value: 'Africa Region' },
              type: { canRead: true, value: 'Region' },
            },
          },
        },
      },
      {
        getState: () => ({
          dirtyFields: {
            marketingLocation: true,
          },
        }),
      }
    );

    expect(mockUpdateProject).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            marketingLocation: 'loc-30',
            marketingRegionOverride: 'mr-30',
          }),
        },
      })
    );
  });

  it('clears marketing region override when location changes to one without a default region', async () => {
    renderDialog({ editFields: ['marketingLocation'] });

    const latestProps = mockDialogFormSpy.mock.calls.at(-1)?.[0];
    expect(latestProps?.onSubmit).toBeDefined();

    await latestProps.onSubmit(
      {
        id: 'project-1',
        marketingLocation: {
          id: 'loc-31',
          name: { canRead: true, canEdit: false, value: 'Nairobi' },
          defaultMarketingRegion: {
            canRead: true,
            value: null,
          },
        },
      },
      {
        getState: () => ({
          dirtyFields: {
            marketingLocation: true,
          },
        }),
      }
    );

    expect(mockUpdateProject).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            marketingLocation: 'loc-31',
            marketingRegionOverride: null,
          }),
        },
      })
    );
  });

  it('keeps an explicit marketing region override when both fields are changed', async () => {
    renderDialog({
      editFields: ['marketingLocation', 'marketingRegionOverride'],
    });

    const latestProps = mockDialogFormSpy.mock.calls.at(-1)?.[0];
    expect(latestProps?.onSubmit).toBeDefined();

    await latestProps.onSubmit(
      {
        id: 'project-1',
        marketingLocation: {
          id: 'loc-40',
          name: { canRead: true, canEdit: false, value: 'Nairobi' },
          defaultMarketingRegion: {
            canRead: true,
            value: {
              id: 'mr-40',
              name: { canRead: true, canEdit: false, value: 'Africa Region' },
              type: { canRead: true, value: 'Region' },
            },
          },
        },
        marketingRegionOverride: {
          id: 'mr-override',
          name: { canRead: true, canEdit: false, value: 'Custom Region' },
          type: { canRead: true, value: 'Region' },
        },
      },
      {
        getState: () => ({
          dirtyFields: {
            marketingLocation: true,
          },
          modified: {
            marketingRegionOverride: true,
          },
        }),
      }
    );

    expect(mockUpdateProject).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            marketingLocation: 'loc-40',
            marketingRegionOverride: 'mr-override',
          }),
        },
      })
    );
  });
});
