import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import { useDebounceFn } from 'ahooks';
import { isEqual, merge } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PartnerTypeLabels, PartnerTypeList } from '~/api/schema.graphql';
import { unmatchedIndexThrow } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  multiEnumColumn,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import { useSessionStorage } from '~/hooks/useSessionStorage';
import {
  PartnerProjectDataGridRowFragment as PartnerProject,
  PartnerProjectsDocument,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();
  const [savedGridState, setSavedGridState] =
    useSessionStorage<GridInitialStatePro>(
      `partners-projects-grid-state-${partnerId}`,
      ProjectInitialState
    );
  const prevState = useRef<GridInitialStatePro | null>(null);
  const [props] = useDataGridSource({
    query: PartnerProjectsDocument,
    variables: { partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: ProjectToolbar,
      } satisfies DataGridProps['slots']),
    [props.slots]
  );
  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  const onStateChange = useDebounceFn(
    () => {
      const gridState = props.apiRef.current.exportState();
      if (!isEqual(gridState, prevState.current)) {
        prevState.current = gridState;
        setSavedGridState(gridState);
      }
    },
    { wait: 500, maxWait: 500 }
  );

  useEffect(() => {
    props.apiRef.current.restoreState(savedGridState);
  }, [savedGridState, props.apiRef]);

  return (
    <TabPanelContent>
      <DataGrid<PartnerProject>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={PartnerProjectColumns}
        initialState={ProjectInitialState}
        headerFilters
        hideFooter
        onStateChange={onStateChange.run}
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};

const PartnershipTypesColumn: GridColDef<PartnerProject> = {
  field: 'partnerships.types',
  ...multiEnumColumn(PartnerTypeList, PartnerTypeLabels),
  headerName: 'Partnership Roles',
  width: 160,
  valueGetter: (_, { partnership }) => partnership.types.value,
};

const indexAfterStatus =
  unmatchedIndexThrow(ProjectColumns.findIndex((c) => c.field === 'status')) +
  1;

const PartnerProjectColumns =
  // Avoid contravariance constraint on `row` parameter of `valueGetter`.
  // This function is called for us, and we just want to enforce that
  // the `row` is _at least_ a `Project`.
  // The actual enforcement below.
  (ProjectColumns as Array<GridColDef<PartnerProject>>)
    // Add types' column after status
    .toSpliced(indexAfterStatus, 0, PartnershipTypesColumn);

// Actually enforce superset constraint here, since we're ignoring above.
const _EnforcePartnerProjectIsSupersetOfProject: Project =
  undefined as unknown as PartnerProject;
