import { useTheme } from '@material-ui/core';
import { Column } from 'material-table';
import React, { FC } from 'react';
import {
  displayProductTypes,
  getProducibleName,
  getProductType,
} from '../../../api';
import { ProductCardFragment } from '../../../components/ProductCard/ProductCard.generated';
import { Table } from '../../../components/Table';

interface ProductsTableProps {
  products: ProductCardFragment[];
}

export const ProductsTable: FC<ProductsTableProps> = ({ products }) => {
  const { spacing } = useTheme();
  const headerStyle: React.CSSProperties = {
    padding: spacing(1, 2),
  };

  const cellStyle: React.CSSProperties = {
    padding: spacing(1, 2),
  };

  const productType = getProductType(products[0]);
  const productTypeDisplayName = displayProductTypes(productType);
  const productSteps = products[0]?.productSteps.items || [];

  const tableData = products.map((product) => {
    const row: { [key: string]: any } = {
      name: getProducibleName(product) || '',
    };
    for (const step of product.productSteps.items) {
      row[step.name] = step.progress;
    }
    return row;
  });

  const columns: Array<Column<any>> = [
    {
      title: 'ID',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Products',
      field: 'name',
      headerStyle,
      cellStyle,
    },
    ...productSteps.map((step) => ({
      title: step.name,
      field: step.name,
      headerStyle,
      cellStyle,
      render: (row: any) => `${row[step.name] || 0}%`,
    })),
  ];

  return (
    <Table
      title={`${productTypeDisplayName} Products`}
      columns={columns}
      data={tableData}
    />
  );
};
