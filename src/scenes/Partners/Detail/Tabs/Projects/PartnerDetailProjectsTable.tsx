import { Box } from '@mui/material';
import { DataGrid, DataGridProps, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { ProjectStatusLabels } from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { SensitivityIcon } from '~/components/Sensitivity';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerDetailProjectsTableListItemFragment } from './PartnerDetailProjectsTable.graphql';

export interface PartnerDetailProjectsTableProps {
  projects: readonly PartnerDetailProjectsTableListItemFragment[];
  GridProps?: Omit<DataGridProps<RowData>, 'columns' | 'isCellEditable'>;
}

export interface RowData {
  id: string;
  label: string;
  data: PartnerDetailsFragment[];
}

export const PartnerDetailProjectsTable = ({
  projects,
}: PartnerDetailProjectsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/projects/${params.row.id}`);
  };

  return (
    <DataGrid<PartnerDetailProjectsTableListItemFragment>
      density="compact"
      initialState={{
        sorting: {
          sortModel: [{ field: 'name', sort: 'desc' }],
        },
      }}
      disableColumnMenu
      disableSelectionOnClick
      autoHeight
      hideFooter={true}
      sx={{
        // TODO
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
        '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
          '&:focus, &:focus-within': { outline: 'none' },
        },
        '& .MuiDataGrid-columnHeader:nth-last-of-type(-n+1) .MuiDataGrid-columnSeparator--sideRight':
          {
            display: 'none',
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
