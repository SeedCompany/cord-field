import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { SetOptional } from 'type-fest';
import {
  AiAssistedTranslationLabels,
  AiAssistedTranslationList,
  EngagementFilters,
  EngagementListInput,
} from '~/api/schema.graphql';
import { CalendarDate, extendSx } from '~/common';
import {
  booleanColumn,
  DefaultDataGridStyles,
  enumColumn,
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
import { LinkColumn } from '~/components/Grid/Columns/LinkColumn';
import { ProjectNameColumn } from '~/components/Grid/Columns/ProjectNameColumn';
import { Link } from '~/components/Routing';
import {
  EngagementUsingAiDataGridRowFragment as EngagementUsingAI,
  EngagementUsingAiListDocument,
} from './engagementsUsingAIDataGridRow.graphql';

export type EngagementUsingAIColumnMapShape = Record<
  string,
  SetOptional<GridColDef<EngagementUsingAI>, 'field'>
>;

export const EngagementUsingAIColumnMap = {
  project: ProjectNameColumn({
    field: 'project.name',
    valueGetter: (_, engagement) => engagement.project,
  }),
  language: {
    headerName: 'Language / Intern',
    field: 'nameProjectLast',
    ...textColumn(),
    width: 200,
    valueGetter: (_, row) => {
      return row.__typename === 'LanguageEngagement'
        ? row.language.value?.name.value
        : row.__typename === 'InternshipEngagement'
        ? row.intern.value?.fullName
        : null;
    },
    renderCell: ({ value, row }) => {
      return row.__typename === 'LanguageEngagement' ? (
        <Link to={`/languages/${row.language.value!.id}`}>{value}</Link>
      ) : row.__typename === 'InternshipEngagement' ? (
        <Link to={`/users/${row.intern.value!.id}`}>{value}</Link>
      ) : null;
    },
    hideable: false,
    serverFilter: (value): EngagementFilters => ({ engagedName: value }),
  },
  viewEngagement: LinkColumn({
    field: 'Engagement',
    headerName: '',
    valueGetter: (_, engagement) => engagement,
    destination: (id) => `/engagements/${id}`,
  }),
  usingAIAssistedTranslation: {
    headerName: 'AI Assistance',
    description: 'Is using AI assistance in translation?',
    field: 'usingAIAssistedTranslation',
    width: 150,
    ...enumColumn(AiAssistedTranslationList, AiAssistedTranslationLabels),
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.usingAIAssistedTranslation.value
        : null,
    filterable: true,
  },
  tool: {
    headerName: 'AI Tools',
    field: 'tool',
    ...textColumn(),
    flex: 1,
    valueGetter: (_, row) =>
      row.tools.items
        .reduce((acc, toolUsage) => {
          if (toolUsage.tool.aiBased.value) {
            acc.push(toolUsage.tool.name.value!);
          }
          return acc;
        }, [] as string[])
        .join(', '),
    sortable: false,
    filterable: true,
    serverFilter: (value): EngagementFilters => ({
      tools: {
        name: value,
      },
    }),
  },
  isMember: {
    headerName: 'Mine',
    field: 'project.isMember',
    ...booleanColumn(),
    valueGetter: (_, engagement) => engagement.project.isMember,
  },
  pinned: {
    headerName: 'Pinned',
    field: 'project.pinned',
    ...booleanColumn(),
    valueGetter: (_, engagement) => engagement.project.pinned,
  },
} satisfies EngagementUsingAIColumnMapShape;

const columns = Object.values(EngagementUsingAIColumnMap);

export interface EngagementsUsingAIGridProps extends DataGridProps {
  quarter: CalendarDate;
  expanded: boolean;
}

export const EngagementsUsingAIGrid = ({
  quarter,
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
        ...getInitialVisibility(columns),
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
      columns={columns}
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
