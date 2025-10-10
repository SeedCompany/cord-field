import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import {
  AiAssistedTranslationLabels,
  AiAssistedTranslationList,
  EngagementFilters,
  EngagementStatusLabels,
  EngagementStatusList,
  LanguageMilestoneLabels,
  LanguageMilestoneList,
  ProgressReportStatusLabels,
  ProgressReportStatusList,
  ProjectStatusLabels,
  ProjectStatusList,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  ProjectTypeList,
} from '~/api/schema.graphql';
import {
  booleanColumn,
  dateColumn,
  enumColumn,
  getInitialVisibility,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  textColumn,
  Toolbar,
  useEnumListFilterToggle,
  useFilterToggle,
} from '../Grid';
import { LinkColumn } from '../Grid/Columns/LinkColumn';
import { ProjectNameColumn } from '../Grid/Columns/ProjectNameColumn';
import { SensitivityColumn } from '../Grid/Columns/SensitivityColumn';
import { Link } from '../Routing';
import { EngagementDataGridRowFragment as Engagement } from './engagementDataGridRow.graphql';

export const EngagementColumns: Array<GridColDef<Engagement>> = [
  ProjectNameColumn({
    field: 'project.name',
    valueGetter: (_, engagement) => engagement.project,
  }),
  LinkColumn({
    field: 'Engagement',
    headerName: '',
    valueGetter: (_, engagement) => engagement,
    destination: (id) => `/engagements/${id}`,
  }),
  {
    headerName: 'Language / Intern',
    field: 'nameProjectLast',
    ...textColumn(),
    width: 200,
    valueGetter: (_, row) => {
      return row.__typename === 'LanguageEngagement'
        ? row.language.value?.name.value
        : row.__typename === 'InternshipEngagement'
        ? row.intern.value?.fullName
        : null;
    },
    renderCell: ({ value, row }) => {
      return row.__typename === 'LanguageEngagement' ? (
        <Link to={`/languages/${row.language.value!.id}`}>{value}</Link>
      ) : row.__typename === 'InternshipEngagement' ? (
        <Link to={`/users/${row.intern.value!.id}`}>{value}</Link>
      ) : null;
    },
    hideable: false,
    serverFilter: (value): EngagementFilters => ({ engagedName: value }),
  },
  {
    headerName: 'Milestone',
    description: 'Completion of milestone translation goals within this MOU',
    field: 'milestonePlanned',
    ...enumColumn(LanguageMilestoneList, LanguageMilestoneLabels),
    width: 130,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.milestonePlanned.value
        : null,
    filterable: true,
    editable: true,
    isEditable: ({ row }) =>
      row.__typename === 'LanguageEngagement' && row.milestonePlanned.canEdit,
    valueSetter: (value, row) =>
      row.__typename === 'LanguageEngagement'
        ? { ...row, milestonePlanned: { ...row.milestonePlanned, value } }
        : row,
  },
  {
    headerName: 'AI Assistance',
    description: 'Is using AI assistance in translation?',
    field: 'usingAIAssistedTranslation',
    width: 130,
    ...enumColumn(AiAssistedTranslationList, AiAssistedTranslationLabels),
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.usingAIAssistedTranslation.value
        : null,
    filterable: true,
    editable: true,
    isEditable: ({ row }) =>
      row.__typename === 'LanguageEngagement' &&
      row.usingAIAssistedTranslation.canEdit,
    valueSetter: (value, row) =>
      row.__typename === 'LanguageEngagement'
        ? {
            ...row,
            usingAIAssistedTranslation: {
              ...row.usingAIAssistedTranslation,
              value,
            },
          }
        : row,
  },
  {
    headerName: 'Type',
    field: 'project.type',
    ...enumColumn(ProjectTypeList, ProjectTypeLabels),
    width: 130,
    valueGetter: (_, row) => row.project.type,
  },
  {
    field: 'project.status',
    ...enumColumn(ProjectStatusList, ProjectStatusLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) => row.project.status,
    headerName: 'Project Status',
    width: 160,
  },
  {
    headerName: 'Project Step',
    field: 'project.step',
    width: 250,
    valueGetter: (_, row) => row.project.step.value,
    ...enumColumn(ProjectStepList, ProjectStepLabels, {
      orderByIndex: true,
    }),
  },
  {
    headerName: 'Engagement Status',
    field: 'status',
    ...enumColumn(EngagementStatusList, EngagementStatusLabels, {
      orderByIndex: true,
    }),
    width: 190,
    valueGetter: (_, row) => row.status.value,
  },
  {
    headerName: 'Country',
    field: 'project.primaryLocation.name',
    ...textColumn(),
    valueGetter: (_, row) => row.project.primaryLocation.value?.name.value,
  },
  {
    headerName: 'ISO',
    description: 'Ethnologue Code',
    field: 'language.ethnologue.code',
    ...textColumn(),
    width: 95,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.ethnologue.code.value?.toUpperCase()
        : null,
  },
  {
    headerName: 'ROLV',
    description: 'Registry of Language Varieties Code',
    field: 'language.registryOfLanguageVarietiesCode',
    ...textColumn(),
    width: 95,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.registryOfLanguageVarietiesCode.value
        : null,
  },
  {
    headerName: 'MOU Start',
    field: 'startDate',
    ...dateColumn(),
    filterable: false,
  },
  {
    headerName: 'MOU End',
    field: 'endDate',
    ...dateColumn(),
    filterable: false,
  },
  {
    headerName: 'QR Status',
    description: 'Status of Quarterly Report Currently Due',
    field: 'currentProgressReportDue.status',
    ...enumColumn(ProgressReportStatusList, ProgressReportStatusLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement' &&
      row.currentProgressReportDue.value
        ? row.currentProgressReportDue.value.status.value
        : null,
    renderCell({ formattedValue: value, row }) {
      const report =
        row.__typename === 'LanguageEngagement'
          ? row.currentProgressReportDue.value
          : undefined;
      if (!report) {
        return null;
      }
      return <Link to={`/progress-reports/${report.id}`}>{value}</Link>;
    },
    filterable: false,
  },
  SensitivityColumn({
    field: 'project.sensitivity',
    valueGetter: (_, engagement) => engagement.project,
  }),
  {
    headerName: 'Files',
    field: 'files',
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => (
      <Link to={`/projects/${row.project.id}/files`}>View Files</Link>
    ),
  },
  {
    field: 'project.isMember',
    ...booleanColumn(),
    valueGetter: (_, row) => row.project.isMember,
    headerName: 'Member',
  },
  {
    field: 'project.pinned',
    ...booleanColumn(),
    valueGetter: (_, row) => row.project.pinned,
    headerName: 'Pinned',
  },
];

export const EngagementInitialState = {
  pinnedColumns: {
    left: EngagementColumns.slice(0, 3).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(EngagementColumns),
      'project.status': false,
      'project.isMember': false,
      'project.pinned': false,
    },
  },
} satisfies DataGridProps['initialState'];

export const EngagementToolbar = () => (
  <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('project.isMember')}>
        Mine
      </QuickFilterButton>
      <QuickFilterButton {...useFilterToggle('project.pinned')}>
        Pinned
      </QuickFilterButton>
      <QuickFilterButton
        {...useEnumListFilterToggle('project.status', 'Active')}
      >
        Active
      </QuickFilterButton>
      <QuickFilterButton
        {...useEnumListFilterToggle('project.status', 'InDevelopment')}
      >
        In Development
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);
