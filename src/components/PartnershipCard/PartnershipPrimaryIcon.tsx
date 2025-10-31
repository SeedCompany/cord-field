import { Star } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { extendSx } from '~/common';

export const PartnershipPrimaryIcon = ({ sx, ...rest }: SvgIconProps) => {
  return (
    <Tooltip title="Primary">
      <Star
        sx={[
          {
            color: '#ffb400',
          },
          ...extendSx(sx),
        ]}
        {...rest}
      />
    </Tooltip>
  );
};
