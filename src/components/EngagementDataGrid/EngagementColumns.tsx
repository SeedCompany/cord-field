import { GridColDef } from '@mui/x-data-grid-pro';
import { cleanJoin } from '@seedcompany/common';
import {
  EngagementStatusLabels,
  EngagementStatusList,
  ProgressReportStatusLabels,
  ProgressReportStatusList,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  ProjectTypeList,
} from '../../api/schema/enumLists';
import { enumColumn, textColumn } from '../Grid';
import { SensitivityColumn } from '../ProjectDataGrid';
import { Link } from '../Routing';
import { EngagementDataGridRowFragment as Engagement } from './engagementDataGridRow.graphql';

export const EngagementColumns: Array<GridColDef<Engagement>> = [
  {
    headerName: 'Name',
    field: 'nameProjectFirst',
    ...textColumn(),
    minWidth: 200,
    valueGetter: (_, row) =>
      cleanJoin(' - ', [
        row.project.name.value,
        row.__typename === 'LanguageEngagement'
          ? row.language.value?.name.value
          : row.__typename === 'InternshipEngagement'
          ? row.intern.value?.fullName
          : null,
      ]),
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.project.id}`}>{value}</Link>
    ),
    serverFilter: ({ value }) => ({ name: value }),
  },
  {
    headerName: 'Type',
    field: 'project.type',
    ...enumColumn(ProjectTypeList, ProjectTypeLabels),
    width: 130,
    valueGetter: (_, row) => row.project.type,
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
        : '',
  },
  {
    headerName: 'ROD',
    description: 'Registry of Dialects',
    field: 'language.registryOfDialectsCode',
    ...textColumn(),
    width: 95,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.registryOfDialectsCode.value
        : '',
  },
  {
    headerName: 'MOU Start',
    field: 'startDate',
    type: 'date',
    valueGetter: (_, { startDate }) => startDate.value?.toJSDate(),
    filterable: false,
  },
  {
    headerName: 'MOU End',
    field: 'endDate',
    type: 'date',
    valueGetter: (_, { endDate }) => endDate.value?.toJSDate(),
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
  {
    ...SensitivityColumn,
    field: 'project.sensitivity',
    valueGetter: (_, row) => row.project.sensitivity,
  },
  {
    headerName: 'Files',
    field: 'files',
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => (
      <Link to={`/projects/${row.project.id}/files`}>View Files</Link>
    ),
  },
];
