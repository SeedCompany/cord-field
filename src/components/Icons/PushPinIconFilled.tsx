import { SvgIcon, SvgIconProps } from '@material-ui/core';
import * as React from 'react';

export const PushPinIconFilled = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <path
        d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z"
        fillRule="evenodd"
      />
    </g>
  </SvgIcon>
);
