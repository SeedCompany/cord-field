import { Box, Chip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridLocaleText } from '@mui/x-data-grid';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { useNavigate, useParams } from 'react-router-dom';
import {
  EngagementStatusLabels,
  ProgressReportStatusLabels,
  ProjectTypeLabels,
} from '~/api/schema.graphql';
import { Sensitivity } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { FormattedDate } from '~/components/Formatters';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useTable } from '~/hooks';
import {
  PartnerDetailEngagmentsTableListItemFragment as Engagement,
  PartnerDetailEngagementsDocument,
} from './PartnerDetailEngagements.graphql';

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();
  const navigate = useNavigate();

  const [props] = useTable({
    query: PartnerDetailEngagementsDocument,
    variables: { id: partnerId },
    listAt: 'partner.engagements',
    initialInput: {
      count: 20,
      sort: 'status',
    },
  });

  const columns: Array<GridColDef<Engagement>> = [
    {
      headerName: 'Name',
      field: 'project',
      flex: 3.5,
      sortable: true,
      renderCell: ({ row }) => {
        const name =
          row.__typename === 'LanguageEngagement'
            ? `${row.project.name.value} - ${row.language.value?.name.value}`
            : row.project.name.value;
        return (
          <Typography
            color="primary.main"
            variant="body2"
            onClick={() => navigate(`/projects/${row.project.id}`)}
          >
            {name}
          </Typography>
        );
      },
    },
    {
      headerName: 'Type',
      field: 'type',
      flex: 1,
      valueGetter: ({ row }) => labelFrom(ProjectTypeLabels)(row.project.type),
      renderCell: ({ value }) => <Chip label={value} variant="outlined" />,
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 2,
      valueGetter: ({ row }) =>
        labelFrom(EngagementStatusLabels)(row.status.value),
    },
    {
      headerName: 'Country',
      field: 'primaryLocation',
      flex: 1,
      valueGetter: ({ row }) => row.project.primaryLocation.value?.name.value,
    },
    {
      headerName: 'ISO',
      field: 'ethnologue',
      flex: 1,
      valueGetter: ({ row }) =>
        row.__typename === 'LanguageEngagement'
          ? row.language.value?.ethnologue.code.value?.toUpperCase()
          : '',
    },
    {
      headerName: 'ROD',
      field: 'registryOfDialectsCode',
      flex: 1,
      valueGetter: ({ row }) =>
        row.__typename === 'LanguageEngagement'
          ? row.language.value?.registryOfDialectsCode.value
          : '',
    },
    {
      headerName: 'MOU Start',
      field: 'mouStart',
      flex: 1,
      valueGetter: ({ row }) => row.project.mouStart.value,
      renderCell: ({ value }) => {
        return (
          <Typography variant="body2" color="secondaryText">
            <FormattedDate date={value} />
          </Typography>
        );
      },
    },
    {
      headerName: 'MOU End',
      field: 'mouEnd',
      flex: 1,
      valueGetter: ({ row }) => row.project.mouEnd.value,
      renderCell: ({ value }) => {
        return (
          <Typography variant="body2" color="secondaryText">
            <FormattedDate date={value} />
          </Typography>
        );
      },
    },
    {
      headerName: 'QR Status',
      field: 'currentProgressReportDue',
      flex: 1,
      renderCell({ row }) {
        const qrStatus =
          row.__typename === 'LanguageEngagement'
            ? labelFrom(ProgressReportStatusLabels)(
                row.currentProgressReportDue.value?.status.value
              )
            : '';
        return (
          <Typography
            color="primary.main"
            variant="body2"
            onClick={() => navigate(`/engagements/${row.id}/reports/progress`)}
          >
            {qrStatus}
          </Typography>
        );
      },
    },
    {
      headerName: 'Sensitivity',
      field: 'sensitivity',
      flex: 1,
      sortComparator: cmpBy<Sensitivity>((v) =>
        simpleSwitch(v, { Low: 0, Medium: 1, High: 2 })
      ),
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          textTransform="uppercase"
        >
          <SensitivityIcon value={value} disableTooltip />
          {value}
        </Box>
      ),
    },
    {
      headerName: 'Files',
      field: '',
      flex: 1,
      renderCell({ row }) {
        return (
          <Typography
            color="primary.main"
            variant="body2"
            onClick={() => navigate(`/projects/${row.project.id}/files`)}
          >
            View Files
          </Typography>
        );
      },
    },
  ];

  return (
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
        // TODO Somehow change to using Link component
        '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
        '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
          '&:focus, &:focus-within': { outline: 'none' },
        },
      }}
      localeText={localeText}
    />
  );
};

const localeText: Partial<GridLocaleText> = {
  noRowsLabel: 'This partner is not engaged in any engagements',
};
