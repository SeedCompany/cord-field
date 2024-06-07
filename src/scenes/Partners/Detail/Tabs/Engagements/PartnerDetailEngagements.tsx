import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridLocaleText } from '@mui/x-data-grid';
import {
  cleanJoin,
  cmpBy,
  mapEntries,
  simpleSwitch,
} from '@seedcompany/common';
import { useParams } from 'react-router-dom';
import {
  EngagementStatusLabels,
  ProgressReportStatusLabels,
  ProgressReportStatusList,
  ProjectStepLabels,
  ProjectTypeLabels,
} from '~/api/schema.graphql';
import { Sensitivity } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { FormattedDate } from '~/components/Formatters';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useTable } from '~/hooks';
import { Link } from '../../../../../components/Routing';
import { PartnerTabContainer } from '../PartnerTabContainer';
import {
  PartnerDetailEngagementsTableListItemFragment as Engagement,
  PartnerDetailEngagementsDocument,
} from './PartnerDetailEngagements.graphql';

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();

  const [props] = useTable({
    query: PartnerDetailEngagementsDocument,
    variables: { id: partnerId },
    listAt: 'partner.engagements',
    initialInput: {
      count: 20,
      sort: 'nameProjectFirst',
    },
  });

  return (
    <PartnerTabContainer sx={{ p: 0 }}>
      <DataGrid<Engagement>
        autoHeight
        density="compact"
        disableColumnMenu
        {...props}
        columns={columns}
        disableSelectionOnClick
        sx={{
          border: 'none',
          pt: 1,
          '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
            '&:focus, &:focus-within': { outline: 'none' },
          },
        }}
        localeText={localeText}
      />
    </PartnerTabContainer>
  );
};

const localeText: Partial<GridLocaleText> = {
  noRowsLabel: 'This partner does not have any engagements',
};

const columns: Array<GridColDef<Engagement>> = [
  {
    headerName: 'Name',
    field: 'nameProjectFirst',
    minWidth: 200,
    valueGetter: ({ row }) =>
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
  },
  {
    headerName: 'Type',
    field: 'project.type',
    width: 130,
    valueGetter: ({ row }) => labelFrom(ProjectTypeLabels)(row.project.type),
    renderCell: ({ value }) => <Chip label={value} variant="outlined" />,
  },
  {
    headerName: 'Project Step',
    field: 'project.step',
    width: 250,
    valueGetter: ({ row }) =>
      labelFrom(ProjectStepLabels)(row.project.step.value),
  },
  {
    headerName: 'Engagement Status',
    field: 'status',
    width: 190,
    valueGetter: ({ row }) =>
      labelFrom(EngagementStatusLabels)(row.status.value),
  },
  {
    headerName: 'Country',
    field: 'project.primaryLocation.name',
    valueGetter: ({ row }) => row.project.primaryLocation.value?.name.value,
  },
  {
    headerName: 'Ethnologue Code',
    field: 'language.ethnologue.code',
    width: 75,
    valueGetter: ({ row }) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.ethnologue.code.value?.toUpperCase()
        : '',
    renderHeader: () => (
      <Tooltip title="Ethnologue Code">
        <Typography variant="inherit">ISO</Typography>
      </Tooltip>
    ),
  },
  {
    headerName: 'Registry of Dialects',
    field: 'language.registryOfDialectsCode',
    width: 80,
    valueGetter: ({ row }) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.registryOfDialectsCode.value
        : '',
    renderHeader: () => (
      <Tooltip title="Registry of Dialects">
        <Typography variant="inherit">ROD</Typography>
      </Tooltip>
    ),
  },
  {
    headerName: 'MOU Start',
    field: 'startDate',
    valueGetter: ({ value }) => value.value,
    renderCell: ({ value }) => <FormattedDate date={value} />,
  },
  {
    headerName: 'MOU End',
    field: 'endDate',
    valueGetter: ({ value }) => value.value,
    renderCell: ({ value }) => <FormattedDate date={value} />,
  },
  {
    headerName: 'QR Status',
    field: 'currentProgressReportDue.status',
    valueGetter: ({ row }) =>
      row.__typename === 'LanguageEngagement' &&
      row.currentProgressReportDue.value
        ? labelFrom(ProgressReportStatusLabels)(
            row.currentProgressReportDue.value.status.value
          )
        : null,
    sortComparator: cmpBy((v: string | null) =>
      ProgressReportStatusIndex.get(v)
    ),
    renderHeader: () => (
      <Tooltip title="Status of Querterly Report Currently Due">
        <Typography variant="inherit">QR Status</Typography>
      </Tooltip>
    ),
    renderCell({ value, row }) {
      const report =
        row.__typename === 'LanguageEngagement'
          ? row.currentProgressReportDue.value
          : undefined;
      if (!report) {
        return null;
      }
      return <Link to={`/progress-reports/${report.id}`}>{value}</Link>;
    },
  },
  {
    headerName: 'Sensitivity',
    field: 'sensitivity',
    sortComparator: cmpBy<Sensitivity>((v) =>
      simpleSwitch(v, { Low: 0, Medium: 1, High: 2 })
    ),
    valueGetter: ({ row }) => row.project.sensitivity,
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
  },
  {
    headerName: 'Files',
    field: 'files',
    sortable: false,
    renderCell: ({ row }) => (
      <Link to={`/projects/${row.project.id}/files`}>View Files</Link>
    ),
  },
];

const ProgressReportStatusIndex = mapEntries(
  [null, ...ProgressReportStatusList].entries(),
  ([i, v]) => [!v ? null : ProgressReportStatusLabels[v], i - 1]
).asMap;
