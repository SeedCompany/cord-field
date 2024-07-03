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
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--DataGrid-containerBackground)',
          p: 1,
          borderBottom: 'thin solid var(--DataGrid-rowBorderColor)',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
        },
        ...extendSx(props.sx),
      ]}
    >
      {props.children}
      {rootProps.rowCount && (
        <Typography>
          Total Rows: <FormattedNumber value={rootProps.rowCount} />
        </Typography>
      )}
    </Stack>
  );
};
