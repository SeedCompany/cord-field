import { Box, Card } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { sortBy, uniq } from 'lodash';
import { useMemo } from 'react';
import { ProductStep, ProductStepLabels } from '~/api/schema.graphql';
import { bookIndexFromName } from '../../../common/biblejs';
import { Link } from '../../../components/Routing';
import { ProgressOfProductForReportFragment } from './ProgressReportDetail.graphql';

interface ProductTableProps {
  category: string;
  products: readonly ProgressOfProductForReportFragment[];
}

type RowData = {
  id: string;
  label: string;
  data: ProgressOfProductForReportFragment;
} & {
  [K in ProductStep]?: string;
};

export const ProductTable = ({ products, category }: ProductTableProps) => {
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
            <Box sx={{ lineHeight: 'initial' }}>
              <div>
                {one} {sep}
              </div>
              {two && <div>{two}</div>}
            </Box>
          );
        },
        field: step,
        width: 100,
        renderCell: ({ row }) =>
          row[step] ? (
            row[step]
          ) : row.data.steps.find((s) => s.step === step) ? (
            ''
          ) : (
            <>&mdash;</>
          ),
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
    };
    const measurement = product.progressStepMeasurement.value;
    for (const { step, completed } of progress.steps) {
      if (completed.value == null) {
        continue;
      }
      row[step] =
        measurement === 'Percent'
          ? `${completed.value}%`
          : measurement === 'Boolean'
          ? 'Completed'
          : measurement === 'Number'
          ? `${completed.value}/${product.progressTarget.value ?? ''}`
          : '';
    }
    return row;
  });

  return (
    <Card sx={{ maxWidth: 'lg' }}>
      <DataGrid<RowData>
        columns={columns}
        rows={tableData}
        autoHeight
        disableColumnMenu
        components={{
          Footer: () => null,
        }}
      />
    </Card>
  );
};
