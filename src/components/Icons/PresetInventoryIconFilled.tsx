import { SvgIcon, SvgIconProps } from '@material-ui/core';
import { forwardRef } from 'react';

export const PresetInventoryIconFilled = forwardRef<
  SVGSVGElement,
  SvgIconProps
>(function PresetInventoryIconFilled(props, ref) {
  return (
    <SvgIcon {...props} ref={ref} viewBox="0 0 24 24">
      <g>
        <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM10 17H5v-2h5v2zm0-4H5v-2h5v2zm0-4H5V7h5v2zm4.8 6L12 12.2l1.4-1.4 1.4 1.4L18 9l1.4 1.4-4.6 4.6z" />
      </g>
    </SvgIcon>
  );
});
