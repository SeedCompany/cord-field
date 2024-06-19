import { Box, Chip } from '@mui/material';
import {
  DataGridPro as DataGrid,
  GridColDef,
  GridLocaleText,
} from '@mui/x-data-grid-pro';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { useParams } from 'react-router-dom';
import { ProjectStatusLabels, ProjectTypeLabels } from '~/api/schema/enumLists';
import { Sensitivity } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useTable } from '~/hooks';
import { Link } from '../../../../../components/Routing';
import { PartnerTabContainer } from '../PartnerTabContainer';
import {
  PartnerProjectsDocument,
  PartnerDetailProjectsTableListItemFragment as Project,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useTable({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
      count: 20,
    },
  });

  return (
    <PartnerTabContainer sx={{ p: 0 }}>
      <DataGrid<Project>
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
  noRowsLabel: 'This partner is not engaged in any projects',
};

const columns: Array<GridColDef<Project>> = [
  {
    headerName: 'Project Name',
    field: 'name',
    flex: 2,
    valueGetter: (_, { name }) => name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.id}`}>{value}</Link>
    ),
  },
  {
    headerName: 'Status',
    field: 'status',
    flex: 1,
    valueGetter: labelFrom(ProjectStatusLabels),
  },
  {
    headerName: 'Type',
    field: 'type',
    flex: 0.75,
    valueGetter: labelFrom(ProjectTypeLabels),
    renderCell: ({ value }) => <Chip label={value} variant="outlined" />,
  },
  {
    headerName: 'Engagements',
    field: 'engagements',
    flex: 0.5,
    valueGetter: (_, { engagements }) => engagements.total,
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
