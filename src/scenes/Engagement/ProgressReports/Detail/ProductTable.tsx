import { Dictionary, indexOf, keyBy, uniq } from 'lodash';
import { Column } from 'material-table';
import React, { useMemo } from 'react';
import { displayProductStep, MethodologyStep } from '../../../../api';
import { ProductCardFragment } from '../../../../components/ProductCard/ProductCard.generated';
import { Table } from '../../../../components/Table';
import { AvailableMethodologyStepsFragment } from '../../../Products/ProductForm/ProductForm.generated';

interface ProductTableProps {
  category: string;
  products: ProductCardFragment[];
  methodologyAvailableSteps: readonly AvailableMethodologyStepsFragment[];
}

const mergeMethodologySteps = (
  steps1: readonly MethodologyStep[],
  steps2: readonly MethodologyStep[]
) => {
  let mergedSteps = [...steps1];
  let mergingSteps = [...steps2];

  while (mergingSteps.length) {
    // eslint-disable-next-line no-loop-func
    const index = mergingSteps.findIndex((step2) =>
      mergedSteps.find((step1) => step1 === step2)
    );
    if (index < 0) {
      mergedSteps = [...mergedSteps, ...mergingSteps];
      mergingSteps = [];
    } else {
      const indexInMergedSteps = indexOf(mergedSteps, mergingSteps[index]);

      mergedSteps = [
        ...mergedSteps.slice(0, indexInMergedSteps),
        ...mergingSteps.splice(0, index),
        ...mergedSteps.slice(indexInMergedSteps),
      ];

      mergingSteps.splice(0, 1); // remove current iterator
    }
  }

  return mergedSteps;
};

export const ProductTable = ({
  products,
  category,
  methodologyAvailableSteps,
}: ProductTableProps) => {
  const steps = uniq(products.flatMap((product) => product.steps.value));

  const availableSteps = useMemo(() => {
    const indexedMethodologyAvailableSteps = keyBy(
      methodologyAvailableSteps,
      (ms) => ms.methodology
    );

    let availableSteps: MethodologyStep[] = [];
    products
      .filter((product) => product.methodology.value)
      .forEach((product, index) => {
        const methodologyAvailableStepsForProduct =
          indexedMethodologyAvailableSteps[product.methodology.value ?? '']
            ?.steps ?? [];
        if (index === 0) {
          availableSteps = [...methodologyAvailableStepsForProduct];
        } else {
          availableSteps = [
            ...mergeMethodologySteps(
              availableSteps,
              methodologyAvailableStepsForProduct
            ),
          ];
        }
      });
    return availableSteps;
  }, [methodologyAvailableSteps, products]);

  const columns: Array<Column<any>> = [
    {
      title: category,
      field: 'label',
      headerStyle: {
        fontSize: '24px',
      },
    },
    ...availableSteps.map((step) => ({
      title: displayProductStep(step),
      field: step,
    })),
  ];

  const tableData = products.map((product) => {
    const row: Dictionary<string | number> = { label: product.label ?? '' };
    const measurement = product.progressStepMeasurement.value;
    steps.forEach((step) => {
      const progressStep = product.progressOfCurrentReportDue?.steps.find(
        (s) => s.step === step
      );
      if (progressStep?.completed.value) {
        row[step] =
          measurement === 'Percent'
            ? `${progressStep.completed.value}%`
            : measurement === 'Boolean'
            ? 'Completed'
            : '';
      }
    });
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
