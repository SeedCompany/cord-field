import { Box } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { useNavigate } from 'react-router-dom';
import { ProjectStatusLabels } from '~/api/schema/enumLists';
import { Sensitivity } from '~/api/schema/schema.graphql';
import { extendSx, labelFrom } from '~/common';
import { SensitivityIcon } from '~/components/Sensitivity';
import { PartnerDetailProjectsTableListItemFragment as Project } from './PartnerProjects.graphql';

export type PartnerDetailProjectsTableProps = Omit<
  DataGridProps<Project>,
  'columns' | 'onRowClick'
>;

export const PartnerDetailProjectsTable = (
  props: PartnerDetailProjectsTableProps
) => {
  const navigate = useNavigate();

  const handleRowClick = (params: GridRowParams<Project>) => {
    navigate(`/projects/${params.row.id}`);
  };

  const columns: Array<GridColDef<Project>> = [
    {
      headerName: 'Project Name',
      field: 'name',
      flex: 2,
      valueGetter: ({ value }) => value.value,
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
  ];

  return (
    <DataGrid
      autoHeight
      density="compact"
      disableColumnMenu
      {...props}
      columns={columns}
      onRowClick={handleRowClick}
      disableSelectionOnClick
      sx={[
        {
          // TODO Somehow change to using Link component
          '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
          '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
            '&:focus, &:focus-within': { outline: 'none' },
          },
        },
        ...extendSx(props.sx),
      ]}
      localeText={{
        noRowsLabel: 'This partner is not engaged in any projects',
        ...props.localeText,
      }}
    />
  );
};
