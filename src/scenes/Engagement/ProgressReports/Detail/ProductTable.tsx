import { sortBy, uniq } from 'lodash';
import { Column } from 'material-table';
import React, { useMemo } from 'react';
import { displayProductStep, ProductStep } from '../../../../api';
import { ProductCardFragment } from '../../../../components/ProductCard/ProductCard.generated';
import { Table } from '../../../../components/Table';

interface ProductTableProps {
  category: string;
  products: ProductCardFragment[];
}

type RowData = { label: string } & { [K in ProductStep]?: string };

export const ProductTable = ({ products, category }: ProductTableProps) => {
  const steps = useMemo(() => {
    return uniq(
      sortBy(
        products.flatMap((product) =>
          product.steps.value.map((step) => ({
            step,
            position: product.availableSteps.indexOf(step),
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
    },
    ...steps.map((step) => ({
      title: displayProductStep(step),
      field: step,
    })),
  ];

  const tableData = products.map((product) => {
    const row: RowData = { label: product.label ?? '' };
    const measurement = product.progressStepMeasurement.value;
    for (const step of steps) {
      const completed = product.progressOfCurrentReportDue?.steps.find(
        (s) => s.step === step
      )?.completed.value;
      if (completed == null) {
        continue;
      }
      row[step] =
        measurement === 'Percent'
          ? `${completed}%`
          : measurement === 'Boolean'
          ? 'Completed'
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
