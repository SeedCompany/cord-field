import { Box } from '@mui/material';
import { DataGrid, DataGridProps, GridRowParams } from '@mui/x-data-grid';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { useNavigate } from 'react-router-dom';
import { ProjectStatusLabels } from '~/api/schema/enumLists';
import { Sensitivity } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { SensitivityIcon } from '~/components/Sensitivity';
import { PartnerDetailProjectsTableListItemFragment as Project } from './PartnerDetailProjectsTable.graphql';

export interface PartnerDetailProjectsTableProps {
  projects: readonly Project[];
  GridProps?: Omit<DataGridProps<Project>, 'columns' | 'isCellEditable'>;
}

export const PartnerDetailProjectsTable = ({
  projects,
}: PartnerDetailProjectsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (params: GridRowParams<Project>) => {
    navigate(`/projects/${params.row.id}`);
  };

  return (
    <DataGrid<Project>
      density="compact"
      initialState={{
        sorting: {
          sortModel: [{ field: 'name', sort: 'asc' }],
        },
      }}
      disableColumnMenu
      disableSelectionOnClick
      autoHeight
      hideFooter
      sx={{
        // TODO Somehow change to using Link component
        '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
        '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
          '&:focus, &:focus-within': { outline: 'none' },
        },
      }}
      rows={projects}
      onRowClick={handleRowClick}
      sortingOrder={['desc', 'asc']}
      columns={[
        {
          headerName: 'Project Name',
          field: 'name',
          flex: 1,
          valueGetter: ({ value }) => value.value,
          renderCell: ({ value }) => (
            <Box component="span" color="primary.main">
              {value}
            </Box>
          ),
        },
        {
          headerName: 'Status',
          field: 'projectStatus',
          flex: 1,
          valueGetter: ({ value }) => labelFrom(ProjectStatusLabels)(value),
        },
        {
          headerName: 'Engagements',
          field: 'engagements',
          flex: 1,
          valueGetter: ({ value }) => value.total,
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
      ]}
    />
  );
};
