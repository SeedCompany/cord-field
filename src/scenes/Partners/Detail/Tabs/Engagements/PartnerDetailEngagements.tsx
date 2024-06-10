import { Box, Chip } from '@mui/material';
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
    <PartnerTabContainer
      sx={{
        p: 0,
        maxWidth: '100cqw',
        width: 'min-content',
      }}
    >
      <DataGrid<Engagement>
        autoHeight
        density="compact"
        disableColumnMenu
        {...props}
        columns={columns}
        disableRowSelectionOnClick
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
  },
  {
    headerName: 'Type',
    field: 'project.type',
    width: 130,
    valueGetter: (_, row) => labelFrom(ProjectTypeLabels)(row.project.type),
    renderCell: ({ value }) => <Chip label={value} variant="outlined" />,
  },
  {
    headerName: 'Project Step',
    field: 'project.step',
    width: 250,
    valueGetter: (_, row) =>
      labelFrom(ProjectStepLabels)(row.project.step.value),
  },
  {
    headerName: 'Engagement Status',
    field: 'status',
    width: 190,
    valueGetter: (_, row) =>
      labelFrom(EngagementStatusLabels)(row.status.value),
  },
  {
    headerName: 'Country',
    field: 'project.primaryLocation.name',
    valueGetter: (_, row) => row.project.primaryLocation.value?.name.value,
  },
  {
    headerName: 'ISO',
    description: 'Ethnologue Code',
    field: 'language.ethnologue.code',
    width: 75,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.ethnologue.code.value?.toUpperCase()
        : '',
  },
  {
    headerName: 'ROD',
    description: 'Registry of Dialects',
    field: 'language.registryOfDialectsCode',
    width: 80,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.registryOfDialectsCode.value
        : '',
  },
  {
    headerName: 'MOU Start',
    field: 'startDate',
    valueGetter: (_, { startDate }) => startDate.value,
    renderCell: ({ value }) => <FormattedDate date={value} />,
  },
  {
    headerName: 'MOU End',
    field: 'endDate',
    valueGetter: (_, { endDate }) => endDate.value,
    renderCell: ({ value }) => <FormattedDate date={value} />,
  },
  {
    headerName: 'QR Status',
    description: 'Status of Quarterly Report Currently Due',
    field: 'currentProgressReportDue.status',
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement' &&
      row.currentProgressReportDue.value
        ? labelFrom(ProgressReportStatusLabels)(
            row.currentProgressReportDue.value.status.value
          )
        : null,
    sortComparator: cmpBy((v: string | null) =>
      ProgressReportStatusIndex.get(v)
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
    valueGetter: (_, row) => row.project.sensitivity,
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
