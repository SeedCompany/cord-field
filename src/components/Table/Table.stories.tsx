import { action } from '@storybook/addon-actions';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Table as TableComponent } from './Table';

export default { title: 'Components/Table' };

const typeOptions = {
  Boolean: 'boolean' as const,
  Numeric: 'numeric' as const,
  Date: 'date' as const,
  DateTime: 'datetime' as const,
  Time: 'time' as const,
  Currency: 'currency' as const,
  Undefined: undefined,
};

export const Table = () => {
  const rows = [
    {
      id: '456789',
      amount: number('amount.row1', 29000),
      fiscalYear: number('fiscalYear.row1', 2021),
      organization: text('organization.row1', 'Ethnos360'),
      canEdit: boolean('canEdit.row1', true),
    },
    {
      id: '567890',
      amount: number('amount.row2', 3021),
      fiscalYear: number('fiscalYear.row2', 2020),
      organization: text('organization.row2', 'Seed Company'),
      canEdit: boolean('canEdit.row2', false),
    },
    {
      id: '012345',
      amount: number('amount.row3', 2013),
      fiscalYear: number('fiscalYear.row3', 2020),
      organization: text('organization.row3', 'Ethnos360'),
      canEdit: boolean('canEdit.row3', true),
    },
  ];

  const columns = [
    {
      title: text('title.id', 'ID'),
      field: 'id',
      hidden: boolean('hidden', true),
    },
    {
      title: text('title.organization', 'Organization'),
      field: 'organization',
      type: select('organizationType', typeOptions, undefined),
      editable: 'never' as const,
    },
    {
      title: text('title.fiscalYear', 'Fiscal Year'),
      field: 'fiscalYear',
      type: select('fiscalYearType', typeOptions, undefined),
      editable: 'never' as const,
      render: (rowData: any) =>
        text('prefix', 'FY') + String(rowData.fiscalYear),
    },
    {
      title: text('title.amount', 'Amount'),
      field: 'amount',
      type: select('amountType', typeOptions, 'currency'),
      editable: (_: unknown, rowData: any) => !!rowData.canEdit,
    },
    {
      title: text('title.canEdit', 'Can Edit'),
      field: 'canEdit',
      hidden: boolean('hidden', true),
    },
  ];
  const onRowClick = boolean('onRowClick', false)
    ? action('row clicked')
    : undefined;

  return (
    <TableComponent
      columns={columns}
      data={rows}
      isEditable={boolean('isEditable', true)}
      onRowUpdate={() => new Promise((resolve) => resolve())}
      onRowClick={onRowClick}
    />
  );
};
