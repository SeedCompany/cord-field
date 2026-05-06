import { Stack, Typography } from '@mui/material';
import { useGridRootProps } from '@mui/x-data-grid-pro';
import { ChildrenProp, extendSx, StyleProps } from '~/common';
import { FormattedNumber } from '../Formatters';

export const Toolbar = (props: ChildrenProp & StyleProps) => {
  const rootProps = useGridRootProps();

  return (
    <Stack
      {...props}
      sx={[
        {
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          columnGap: 2,
          rowGap: 0,
          background: 'var(--DataGrid-containerBackground)',
          p: 1,
          borderBottom: 'thin solid var(--DataGrid-rowBorderColor)',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          '& > .GridQuickFilters': {
            flex: '1 1 auto',
            minWidth: 0,
            order: 1,
          },
          '& > .GridToolbarRowCount': {
            marginLeft: 'auto',
            order: 2,
            whiteSpace: 'nowrap',
          },
          '& > :not(.GridQuickFilters):not(.GridToolbarRowCount)': {
            order: 1,
          },
          '@media (max-width:755px)': {
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            rowGap: 1,
            '& > .GridQuickFilters': {
              flex: '1 0 100%',
              order: 3,
            },
          },
        },
        ...extendSx(props.sx),
      ]}
    >
      {props.children}
      {rootProps.rowCount != null && (
        <Typography className="GridToolbarRowCount" variant="body2">
          Rows: <FormattedNumber value={rootProps.rowCount} />
        </Typography>
      )}
    </Stack>
  );
};
