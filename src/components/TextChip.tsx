import { Chip } from '@mui/material';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export const TextChip = (props: ChildrenProp & StyleProps) => {
  return (
    <Chip
      label={props.children}
      sx={[{ borderRadius: 1 }, ...extendSx(props.sx)]}
    />
  );
};
