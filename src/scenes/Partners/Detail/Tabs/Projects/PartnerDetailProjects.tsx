import { Box } from '@mui/material';
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
import { useDataGridSource } from '~/components/Grid';
import { SensitivityIcon } from '~/components/Sensitivity';
import { Link } from '../../../../../components/Routing';
import { PartnerTabContainer } from '../PartnerTabContainer';
import {
  PartnerProjectsDocument,
  PartnerDetailProjectsTableListItemFragment as Project,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
      count: 20,
    },
  });

  return (
    <PartnerTabContainer
      sx={{
        flex: 1,
        p: 0,
        maxWidth: '100cqw',
        width: 'min-content',
        // idk why -50, MUI pushes down past container
        maxHeight: 'calc(100cqh - 50px)',
      }}
    >
      <DataGrid<Project>
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
    minWidth: 300,
    valueGetter: (_, { name }) => name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.id}`}>{value}</Link>
    ),
  },
  {
    headerName: 'Type',
    field: 'type',
    width: 130,
    valueGetter: labelFrom(ProjectTypeLabels),
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 160,
    valueGetter: labelFrom(ProjectStatusLabels),
  },
  {
    headerName: 'Engagements',
    field: 'engagements',
    width: 130,
    valueGetter: (_, { engagements }) => engagements.total,
  },
  {
    headerName: 'Sensitivity',
    field: 'sensitivity',
    width: 180,
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
