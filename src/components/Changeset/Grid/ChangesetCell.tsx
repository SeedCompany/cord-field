import { unstable_composeClasses as composeClasses } from '@mui/base';
import { capitalize } from '@mui/material/utils';
import {
  getDataGridUtilityClass,
  GridCell,
  GridCellProps,
  GridValidRowModel,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';
import { DataGridProcessedProps } from '@mui/x-data-grid/models/props/DataGridProps';
import { Fragment } from 'react';
import { useDetermineChangesetDiffItem } from '../ChangesetDiffContext';
import { InlineChangesetBadge } from '../InlineChangesetBadge';
import { PropertyDiff } from '../PropertyDiff';

type OwnerState = Pick<
  GridCellProps,
  'align' | 'showRightBorder' | 'isEditable'
> & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, showRightBorder, isEditable, classes } = ownerState;

  const slots = {
    root: [
      'cell',
      `cell--text${capitalize(align)}`,
      isEditable && 'cell--editable',
      showRightBorder && 'withBorder',
    ],
    content: ['cellContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const ChangesetCell = (props: GridCellProps) => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const determineChangesetDiff = useDetermineChangesetDiffItem();

  const ownerState = {
    align: props.align,
    showRightBorder: props.showRightBorder,
    isEditable: props.isEditable,
    classes: rootProps.classes,
  };
  const classes = useUtilityClasses(ownerState);

  const { column } = props;
  if (!column.changesetAware || props.cellMode === 'edit') {
    return <GridCell {...props} />;
  }

  const valueFormatted = props.formattedValue ?? props.value;

  const row = apiRef.current.getRow(props.rowId);
  const rowDiff = determineChangesetDiff(row);

  if (!rowDiff.mode) {
    return <GridCell {...props} />;
  }

  let moreInfo = undefined;
  if (rowDiff.mode === 'changed') {
    let previousValue =
      rowDiff.previous[props.field as keyof typeof rowDiff.previous];
    previousValue = column.valueGetter
      ? column.valueGetter(
          previousValue as never,
          rowDiff.previous,
          column,
          apiRef
        )
      : previousValue;
    const previousFormatted = column.valueFormatter
      ? column.valueFormatter(
          previousValue as never,
          rowDiff.previous,
          column,
          apiRef
        )
      : previousValue;

    if (previousFormatted === valueFormatted) {
      return <GridCell {...props} />;
    }
    moreInfo = (
      <PropertyDiff
        previous={previousFormatted}
        current={valueFormatted}
        sx={props.align === 'right' ? { alignItems: 'flex-end' } : undefined}
      />
    );
  }

  let children = props.children;
  if (children == null) {
    children = (
      <div className={classes.content}>{valueFormatted?.toString()}</div>
    );
  }
  let merged = [
    <Fragment key="children">{children}</Fragment>,
    <span key="spacer" css={{ flex: 1 }} />,
    <InlineChangesetBadge
      key="changeset"
      mode={rowDiff.mode}
      tooltipProps={{
        placement: props.align === 'right' ? 'right' : 'left',
      }}
      moreInfo={moreInfo}
    />,
  ];
  merged = props.align === 'right' ? merged.reverse() : merged;

  return <GridCell {...props}>{merged}</GridCell>;
};

declare module '@mui/x-data-grid/models/colDef/gridColDef' {
  // eslint-disable-next-line @seedcompany/no-unused-vars,prettier/prettier
  interface GridBaseColDef<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> {
    changesetAware?: boolean;
  }
}
