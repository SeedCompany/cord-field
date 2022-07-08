import { Skeleton, Typography, TypographyProps } from '@mui/material';
import { ReactElement, ReactNode } from 'react';

export type DisplaySimplePropertyProps = TypographyProps & {
  label?: string;
  LabelProps?: TypographyProps;
  value?: ReactNode;
  ValueProps?: TypographyProps;
  loading?: boolean | ReactNode;
  loadingWidth?: number | string;
  wrap?: (node: ReactElement) => ReactElement;
  propValueWrap?: (node: ReactElement) => ReactElement;
};

export const DisplaySimpleProperty = ({
  label,
  LabelProps,
  value,
  ValueProps,
  loading,
  loadingWidth,
  wrap,
  propValueWrap,
  ...props
}: DisplaySimplePropertyProps) => {
  const shouldRenderElement = loading || (label && value);
  if (!shouldRenderElement) return null;
  const propValue = (
    <Typography component="span" variant="inherit" color="text.secondary" {...ValueProps}>
      {value}
    </Typography>
  );
  const property = (
    <Typography variant="body2" {...props}>
      {loading === true ? (
        <Skeleton width={loadingWidth} />
      ) : loading ? (
        loading
      ) : label && value ? (
        <>
          <Typography component="span" variant="inherit" {...LabelProps}>
            {label}:&nbsp;
          </Typography>
          {propValueWrap ? propValueWrap(propValue) : propValue}
        </>
      ) : null}
    </Typography>
  );
  return wrap ? wrap(property) : property;
};
