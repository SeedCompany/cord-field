import { Typography, TypographyProps } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { ReactElement, ReactNode } from 'react';

export type DisplaySimplePropertyProps = TypographyProps & {
  label?: string;
  LabelProps?: TypographyProps;
  value?: ReactNode;
  ValueProps?: TypographyProps;
  loading?: boolean | ReactNode;
  loadingWidth?: number | string;
  wrap?: (node: ReactElement) => ReactElement;
};

export const DisplaySimpleProperty = ({
  label,
  LabelProps,
  value,
  ValueProps,
  loading,
  loadingWidth,
  wrap,
  ...props
}: DisplaySimplePropertyProps) => {
  const shouldRenderElement = loading || (label && value);
  if (!shouldRenderElement) return null;
  const property = (
    <Typography variant="body2" {...props}>
      {loading === true ? (
        <Skeleton width={loadingWidth} />
      ) : loading ? (
        loading
      ) : label && value ? (
        <>
          <Typography variant="inherit" {...LabelProps}>
            {label}:&nbsp;
          </Typography>
          <Typography variant="inherit" color="textSecondary" {...ValueProps}>
            {value}
          </Typography>
        </>
      ) : null}
    </Typography>
  );
  return wrap ? wrap(property) : property;
};
