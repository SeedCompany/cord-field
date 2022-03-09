import { sortBy, uniq } from 'lodash';
import { Column } from 'material-table';
import React, { useMemo } from 'react';
import { displayProductStep, ProductStep } from '../../../api';
import { Link } from '../../../components/Routing';
import { Table } from '../../../components/Table';
import { bookIndexFromName } from '../../../util/biblejs';
import { ProgressOfProductForReportFragment } from './ProgressReportDetail.generated';

interface ProductTableProps {
  category: string;
  products: readonly ProgressOfProductForReportFragment[];
}

type RowData = { label: string; data: ProgressOfProductForReportFragment } & {
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

  const columns: Array<Column<RowData>> = [
    {
      title: category,
      field: 'label',
      headerStyle: {
        fontSize: '24px',
      },
      render: ({ data }) => (
        <Link to={`../../../products/${data.product.id}`}>
          {data.product.label}
        </Link>
      ),
    },
    ...steps.map((step) => ({
      title:
        step === 'ExegesisAndFirstDraft' ? (
          <>Exegesis&nbsp;& First&nbsp;Draft</>
        ) : (
          displayProductStep(step)
        ),
      field: step,
      render: (row: RowData) =>
        row[step] ? (
          row[step]
        ) : row.data.steps.find((s) => s.step === step) ? (
          ''
        ) : (
          <>&mdash;</>
        ),
    })),
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
    <Table
      columns={columns}
      data={tableData}
      components={{ Toolbar: () => <></> }}
    />
  );
};
