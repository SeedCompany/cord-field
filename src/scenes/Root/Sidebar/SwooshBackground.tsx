import { makeStyles, SvgIcon, SvgIconProps } from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAgent } from '../../../hooks';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: 'initial',
  },
}));

export const SwooshBackground = ({
  classes: classesProp,
  ...rest
}: SvgIconProps) => {
  const classes = useStyles();
  const ua = useUserAgent();
  const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
  // Fix fill url() in Safari by always using the current path.
  // It's a known bug with <base href="/">
  // Can call conditionally because it will be consistent across renders
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = isSafari ? useLocation() : undefined;
  const urlPrefix = location ? location.pathname + location.search : '';
  return (
    <SvgIcon
      classes={{
        root: clsx(classes.root, classesProp?.root),
        ...classesProp,
      }}
      viewBox="0 0 248 136"
      {...rest}
    >
      <path
        opacity=".526"
        d="M248 122.262s-50.315 24.567-137.481 0C27.856 108.511 36.422 135.479 0 127.906.742 127.326 0 .999 0 .999h248v121.263z"
        fill={`url(${urlPrefix}#paint0_linear)`}
      />
      <path
        opacity=".737"
        d="M.301 128.213s29.224 10.814 116.491-6.699c62.731-13.62 94.831 20.79 131.213 13.445-.741-.562 0-134.959 0-134.959H.301v128.213z"
        fill={`url(${urlPrefix}#paint1_linear)`}
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="51.584"
          y1="20.617"
          x2="121.385"
          y2="157.813"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#467F3B" />
          <stop offset="1" stopColor="#FCFFB1" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="22.347"
          y1="-60.992"
          x2="124.045"
          y2="202.04"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#467F3B" />
          <stop offset="1" stopColor="#3D8AB7" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};
