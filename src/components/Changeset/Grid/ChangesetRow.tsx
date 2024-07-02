import { darken, lighten } from '@mui/material/styles';
import { GridRow, GridRowProps } from '@mui/x-data-grid-pro';
import { Entity } from '~/api';
import { useDetermineChangesetDiffItem } from '../ChangesetDiffContext';
import { modeToPalette } from '../theme';

export function ChangesetRow(props: GridRowProps) {
  const determineChangesetDiff = useDetermineChangesetDiffItem();

  const diff = determineChangesetDiff(props.row as Entity);
  if (!diff.mode) {
    return <GridRow {...props} />;
  }

  return (
    <GridRow
      {...props}
      css={(theme) => {
        const base = theme.palette[modeToPalette[diff.mode]].main;
        const getBgColor = theme.palette.mode === 'light' ? lighten : darken;
        return {
          backgroundColor: getBgColor(base, 0.9),
          '&:hover:hover': {
            backgroundColor: getBgColor(base, 0.8),
          },
          '.MuiCard-root &.MuiDataGrid-row--lastVisible': {
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
          },
        };
      }}
    />
  );
}
