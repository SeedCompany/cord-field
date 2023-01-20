import { Box, Collapse, FormControlLabel, Switch } from '@mui/material';
import { useToggle } from 'ahooks';
import { ChildrenProp, StyleProps } from '~/common';

export const InstructionsToggle = ({
  children,
  ...rest
}: ChildrenProp & StyleProps) => {
  const [checked, set] = useToggle();

  return (
    <Box {...rest}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={set.toggle} />}
        label="Show Instructions"
      />
      <Collapse in={checked}>{children}</Collapse>
    </Box>
  );
};
