import { GppGood, GppMaybe, Shield } from '@mui/icons-material';
import { SvgIcon, SvgIconProps, Tooltip } from '@mui/material';
import { forwardRef } from 'react';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';
import { SvgSkeleton } from '../Icons/SvgSkeleton';

export interface SensitivityIconProps extends SvgIconProps {
  value?: SensitivityType;
  loading?: boolean;
  disableTooltip?: boolean;
}

export const SensitivityIcon = ({
  value,
  loading,
  className,
  disableTooltip,
  ...rest
}: SensitivityIconProps) => {
  const Icon = value && !loading ? icons[value] : Loading;
  return (
    <Tooltip title={!loading && !disableTooltip ? `${value} Sensitivity` : ''}>
      <Icon {...rest} />
    </Tooltip>
  );
};

const Loading = forwardRef<SVGSVGElement, SvgIconProps>(
  function LoadingSensitivity(props, ref) {
    return <Shield component={SvgSkeleton} {...props} ref={ref} />;
  }
);

const High = forwardRef<SVGSVGElement, SvgIconProps>(function HighSensitivity(
  props,
  ref
) {
  return <GppMaybe color="error" {...props} ref={ref} />;
});

const Medium = forwardRef<SVGSVGElement, SvgIconProps>(
  function MediumSensitivity(props, ref) {
    return (
      <SvgIcon color="warning" {...props} ref={ref}>
        <path d="M12 2 4 5v6a11.5 11.5 0 0 0 1.5 5.8 12 12 0 0 0 3.7 4A9.7 9.7 0 0 0 12 22a8.7 8.7 0 0 0 3.5-1.7 10.5 10.5 0 0 0 3-3.5A12.1 12.1 0 0 0 20 11V5Zm0 5 5 5-5 5-5-5zm0 2.8L9.8 12l2.2 2.2 2.2-2.2z" />
      </SvgIcon>
    );
  }
);

const Low = forwardRef<SVGSVGElement, SvgIconProps>(function LowSensitivity(
  props,
  ref
) {
  return <GppGood color="secondary" {...props} ref={ref} />;
});

const icons = { High, Medium, Low };
