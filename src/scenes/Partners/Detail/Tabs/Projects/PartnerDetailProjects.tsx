import { Box, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridLocaleText,
  GridRowParams,
} from '@mui/x-data-grid';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectStatusLabels, ProjectTypeLabels } from '~/api/schema/enumLists';
import { Sensitivity } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useTable } from '~/hooks';
import {
  PartnerProjectsDocument,
  PartnerDetailProjectsTableListItemFragment as Project,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();
  const navigate = useNavigate();

  const [props] = useTable({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
      count: 20,
    },
  });

  const handleRowClick = (params: GridRowParams<Project>) => {
    navigate(`/projects/${params.row.id}`);
  };

  return (
    <DataGrid<Project>
      autoHeight
      density="compact"
      disableColumnMenu
      {...props}
      columns={columns}
      onRowClick={handleRowClick}
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
  noRowsLabel: 'This partner is not engaged in any projects',
};

const columns: Array<GridColDef<Project>> = [
  {
    headerName: 'Project Name',
    field: 'name',
    flex: 2,
    valueGetter: ({ value }) => value,
    renderCell: ({ value }) => (
      <Box component="span" color="primary.main">
        {value}
      </Box>
    ),
  },
  {
    headerName: 'Status',
    field: 'status',
    flex: 1,
    valueGetter: ({ value }) => labelFrom(ProjectStatusLabels)(value),
  },
  {
    headerName: 'Type',
    field: 'type',
    flex: 0.75,
    valueGetter: ({ value }) => labelFrom(ProjectTypeLabels)(value),
    renderCell: ({ value }) => <Chip label={value} variant="outlined" />,
  },
  {
    headerName: 'Engagements',
    field: 'engagements',
    flex: 0.5,
    valueGetter: (value) => value,
  },
  {
    headerName: 'Sensitivity',
    field: 'sensitivity',
    flex: 0.5,
    sortComparator: cmpBy<Sensitivity>((v) =>
      simpleSwitch(v, { Low: 0, Medium: 1, High: 2 })
    ),
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
  },
];
