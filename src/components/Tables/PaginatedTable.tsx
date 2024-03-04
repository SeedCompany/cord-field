import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { extendSx } from '~/common';
import { PartnerDetailLanguagesTableListItemFragment as Language } from '~/scenes/Partners/Detail/Tabs/Languages/PartnerLanguages.graphql';
import { PartnerDetailProjectsTableListItemFragment as Project } from '~/scenes/Partners/Detail/Tabs/Projects/PartnerProjects.graphql';

export type PartnerDetailPaginatedTableProps<T extends GridValidRowModel> =
  Omit<DataGridProps<T>, 'columns' | 'onRowClick'> & {
    columns: Array<GridColDef<T>>;
  };

export const PaginatedTable = <T extends GridValidRowModel>(
  props: PartnerDetailPaginatedTableProps<T>
) => {
  const navigate = useNavigate();
  const location = useLocation();

  // There is a chance to futher refactor this later to have just a row action that is not simply a navigation,
  // but for the 2 current use cases, this works fine for now
  const handleRowClick = (params: GridRowParams<Project | Language>) => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab === 'projects') {
      navigate(`/projects/${params.row.id}`);
    } else if (tab === 'languages') {
      navigate(`/languages/${params.row.id}`);
    }
  };

  return (
    <DataGrid
      autoHeight
      density="compact"
      disableColumnMenu
      {...props}
      columns={props.columns}
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
