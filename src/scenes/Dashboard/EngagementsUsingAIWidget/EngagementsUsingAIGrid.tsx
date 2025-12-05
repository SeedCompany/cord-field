import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { merge, pick } from 'lodash';
import { useMemo } from 'react';
import { SetOptional } from 'type-fest';
import { EngagementFilters, EngagementListInput } from '~/api/schema.graphql';
import { extendSx } from '~/common';
import { EngagementColumnMap } from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  getInitialVisibility,
  noHeaderFilterButtons,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  textColumn,
  Toolbar,
  useDataGridSource,
  useFilterToggle,
} from '~/components/Grid';
import {
  EngagementUsingAiDataGridRowFragment as EngagementUsingAI,
  EngagementUsingAiListDocument,
} from './engagementsUsingAIDataGridRow.graphql';

export type EngagementUsingAIColumnMapShape = Record<
  string,
  SetOptional<GridColDef<EngagementUsingAI>, 'field'>
>;

export const EngagementUsingAIColumns = Object.values({
  ...pick(EngagementColumnMap, [
    'project.name',
    'nameProjectLast',
    'Engagement',
    'usingAIAssistedTranslation',
  ]),
  tool: {
    headerName: 'AI Tools',
    field: 'tool',
    ...textColumn(),
    flex: 1,
    valueGetter: (_, row) =>
      row.tools.items
        .flatMap(({ tool }) => (tool.aiBased.value ? tool.name.value! : []))
        .join(', '),
    sortable: false,
    filterable: true,
    serverFilter: (value): EngagementFilters => ({
      tools: {
        name: value,
      },
    }),
  },
  ...pick(EngagementColumnMap, ['project.isMember', 'project.pinned']),
} satisfies EngagementUsingAIColumnMapShape);

export interface EngagementsUsingAIGridProps extends DataGridProps {
  expanded: boolean;
}

export const EngagementsUsingAIGrid = ({
  expanded,
  ...props
}: Omit<EngagementsUsingAIGridProps, 'columns'>) => {
  const source = useMemo(() => {
    return {
      query: EngagementUsingAiListDocument,
      variables: {
        input: {
          filter: {
            project: {
              status: ['Active'],
            },
            usingAIAssistedTranslation: ['Check', 'Draft', 'DraftAndCheck'],
          },
        } satisfies EngagementListInput,
      },
      listAt: 'engagements',
      initialInput: {
        sort: 'project.name',
        order: 'ASC',
      },
    } as const;
  }, []);

  const [dataGridProps] = useDataGridSource({
    ...source,
    apiRef: props.apiRef,
  });

  const initialState = {
    columns: {
      columnVisibilityModel: {
        ...getInitialVisibility(EngagementUsingAIColumns),
        viewReport: expanded,
        'project.isMember': false,
        'project.pinned': false,
      },
    },
  } satisfies DataGridProps['initialState'];

  const toolbarSlot = {
    toolbar: EngagementsUsingAIToolbar,
  } satisfies DataGridProps['slots'];

  const slots = useMemo(
    () =>
      merge(
        {},
        DefaultDataGridStyles.slots,
        dataGridProps.slots,
        props.slots,
        expanded && toolbarSlot
      ),
    [dataGridProps.slots, props.slots, toolbarSlot, expanded]
  );

  const slotProps = useMemo(
    () =>
      merge(
        {},
        DefaultDataGridStyles.slotProps,
        dataGridProps.slotProps,
        props.slotProps
      ),
    [dataGridProps.slotProps, props.slotProps]
  );

  return (
    <DataGridPro
      {...DefaultDataGridStyles}
      {...dataGridProps}
      {...props}
      columns={EngagementUsingAIColumns}
      initialState={initialState}
      slots={slots}
      slotProps={slotProps}
      disableColumnMenu={!expanded}
      headerFilters={expanded}
      sx={[
        noHeaderFilterButtons,
        !expanded &&
          ((theme) => ({
            '.MuiDataGrid-main': {
              borderTop: `thin solid ${theme.palette.divider}`,
            },
          })),
        ...extendSx(props.sx),
      ]}
    />
  );
};

const EngagementsUsingAIToolbar = () => (
  <Toolbar
    sx={{
      px: 2,
      justifyContent: 'flex-start',
      gap: 2,
      backgroundColor: 'inherit',
    }}
  >
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('project.isMember')}>
        Mine
      </QuickFilterButton>
      <QuickFilterButton {...useFilterToggle('project.pinned')}>
        Pinned
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);
