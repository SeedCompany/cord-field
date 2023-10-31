import { Box, Card } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import { mapEntries, sortBy } from '@seedcompany/common';
import { uniq } from 'lodash';
import { useMemo } from 'react';
import { LiteralUnion } from 'type-fest';
import {
  ProductStep,
  ProductStepLabels,
  SecuredFloatNullable,
} from '~/api/schema.graphql';
import { isSecured } from '../../../common';
import { bookIndexFromName } from '../../../common/biblejs';
import { EditNumberCell } from '../../../components/Grid/EditNumberCell';
import { Link } from '../../../components/Routing';
import { ProgressOfProductForReportFragment } from './ProgressReportDetail.graphql';

interface ProductTableProps {
  category: string;
  products: readonly ProgressOfProductForReportFragment[];
  GridProps?: Omit<
    DataGridProps<RowData>,
    'columns' | 'rows' | 'isCellEditable'
  >;
}

export type RowData = {
  id: string;
  label: string;
  data: ProgressOfProductForReportFragment;
  plannedSteps: ReadonlySet<LiteralUnion<ProductStep, string>>;
} & {
  [K in ProductStep]?: SecuredFloatNullable;
};

export const ProductTable = ({
  products,
  category,
  GridProps = {},
}: ProductTableProps) => {
  const steps = useMemo(() => {
    return uniq(
      sortBy(
        products.flatMap((progress) =>
          progress.steps.map(({ step }) => ({
            step: step,
            position: progress.product.availableSteps.indexOf(step),
          }))
        ),
        (tuple) => tuple.position
      ).map((tuple) => tuple.step)
    );
  }, [products]);

  const editingAttached =
    GridProps.experimentalFeatures?.newEditingApi ||
    (!!GridProps.onRowEditStop && GridProps.editMode === 'row') ||
    (!!GridProps.onCellEditStop && GridProps.editMode === 'cell');

  const columns: Array<GridColDef<RowData>> = [
    {
      headerName: category,
      field: 'label',
      minWidth: 200,
      maxWidth: 400,
      renderHeader: () => <Box sx={{ fontSize: 24 }}>{category}</Box>,
      renderCell: ({ row: { data } }) => (
        <Link to={`../../../products/${data.product.id}`}>
          {data.product.label}
        </Link>
      ),
    },
    ...steps.map(
      (step): GridColDef<RowData> => ({
        renderHeader: () => {
          const label = ProductStepLabels[step];
          const sep = ['&', ' '].find((sep) => label.includes(sep)) ?? '\0';
          const [one, two] = label.split(sep, 2);
          return (
            <Box sx={{ lineHeight: 'initial', textAlign: 'right' }}>
              <div>
                {one} {sep}
              </div>
              {two && <div>{two}</div>}
            </Box>
          );
        },
        field: step,
        width: 100,
        renderCell: ({
          row,
          field,
          value,
        }: GridRenderCellParams<number | null, RowData, string>) => {
          const securedValue = (row as any)[field];
          if (
            !row.plannedSteps.has(step) ||
            (isSecured(securedValue) && !securedValue.canRead)
          ) {
            return <>&mdash;</>;
          }
          if (value == null) {
            return '';
          }
          const measurement = row.data.product.progressStepMeasurement.value;
          if (measurement === 'Percent') {
            return `${value}%`;
          }
          if (measurement === 'Number') {
            return `${value}/${row.data.product.progressTarget.value ?? ''}`;
          }
          if (measurement === 'Boolean') {
            return value ? 'Completed' : 'Not Done';
          }
          return '';
        },
        align: 'right',
        editable: editingAttached,
        valueGetter: ({ value }) => value?.value,
        valueSetter: ({ row, value: raw }) => {
          // Empty string caused by editing and committing too fast.
          // Related to https://github.com/mui/mui-x/issues/3729 I think.
          // We've seen a string here as well, I believe,
          // so attempting to coerce to prevent API errors.
          const value =
            typeof raw === 'number'
              ? raw
              : typeof raw === 'string'
              ? raw === '' || isNaN(Number(raw))
                ? null
                : Number(raw)
              : null;
          return { ...row, [step]: { ...row[step], value } };
        },
        renderEditCell: (
          props: GridRenderEditCellParams<number | null, RowData>
        ) => {
          const target =
            props.row.data.product.progressTarget.value ?? undefined;
          return <EditNumberCell {...props} max={target} />;
        },
      })
    ),
  ];

  const tableData = (
    products[0]?.product.__typename === 'DirectScriptureProduct'
      ? sortBy(products, ({ product }) => {
          const book =
            product.__typename !== 'DirectScriptureProduct'
              ? undefined
              : product.unspecifiedScripture.value?.book ??
                product.scriptureReferences.value[0]?.start.book;
          return book ? bookIndexFromName(book) : -1;
        })
      : products
  ).map((progress) => {
    const product = progress.product;
    const row: RowData = {
      id: product.id,
      data: progress,
      label: product.label ?? '',
      plannedSteps: new Set(progress.steps.map((s) => s.step)),
      ...mapEntries(progress.steps, ({ step, completed }) => [step, completed])
        .asRecord,
    };
    return row;
  });

  return (
    <Card sx={{ maxWidth: 'lg' }}>
      <DataGrid<RowData>
        autoHeight
        disableColumnMenu
        pageSize={GridProps.pagination ? 10 : tableData.length}
        rowsPerPageOptions={[10]}
        components={{
          Footer: GridProps.pagination ? undefined : () => null,
          ...GridProps.components,
        }}
        {...GridProps}
        columns={columns}
        rows={tableData}
        isCellEditable={({ row, field }) => {
          const securedValue = (row as any)[field];
          return (
            row.plannedSteps.has(field) &&
            isSecured(securedValue) &&
            securedValue.canEdit
          );
        }}
      />
    </Card>
  );
};
